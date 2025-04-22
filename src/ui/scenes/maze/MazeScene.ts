import { Vec2d } from '../../../types';
import { LoopArgs, Scene, StartArgs } from '../../core/Scene';
import { MazeFacade } from '../../../maze/god';
import { OrthographicCamera } from '../../core/OrthographicCamera';
import { InstancedMesh, Mesh, PointLightHelper, Object3D as ThreeObject, Vector3 } from 'three';
import { Random } from '../../../utils/Random';
import { PointLight } from '../../core/PointLight';
import { DirectionalLight } from '../../core/DirectionalLight';
import MazePathFinder, { MPFLabelChangeCallbackParams } from '../../../maze/MazePathFinder';
import { GlowingBox } from './models/GlowingBox';
import { LabelBoxGroup } from './models/LabelBoxGroup';
import playBoxSpawnAnimation from './animations/playBoxSpawnAnimation';
import playGroupFallAnimation from './animations/playGroupFallAnimation';
import { ModelGroup } from '../../core/ModelGroup';
import { MazePathFinderNode, MazePathFinderNodeLabel } from '../../../maze/MazePathFinderNode';
import { EmissiveBox } from './models/EmissiveBoxGroup';
import { Mouse } from '../../core/Mouse';
import { MazeSceneUserInterface } from './MazeSceneUserInterface';
import { MazeNodePositionConverter } from './MazeNodePositionConverter';
import { MazeSerializer } from './MazeSerializer';
import { Plane } from './models/Plane';
import { IndicatorBox } from './models/IndicatorBox';

type BoxNode = { pos: Vec2d; node: MazePathFinderNode; activeGroup: ModelGroup; index: number };
type LabelGroup = MazePathFinderNodeLabel | 'default';
type LabelBox = { label?: LabelGroup; group: ModelGroup; color: number; emissive: EmissiveBox };

export class MazeScene extends Scene {
    private _gap = 0.2;
    private _boxSize = LabelBoxGroup.boxSize;
    private _ui = new MazeSceneUserInterface();
    private _positionConverter = new MazeNodePositionConverter(this._gap, this._boxSize);

    private _boxNodes: BoxNode[] = [];
    private _labelGroups = new Map<LabelGroup, LabelBox>();

    private _maze = new MazeFacade();
    private _mazeFinder: MazePathFinder<MazePathFinderNode>;
    private _steps: MPFLabelChangeCallbackParams[] = [];
    private _start: Vec2d;
    private _finish: Vec2d;

    private _cursorIndicator: IndicatorBox;
    private _lightIndicator: PointLight;
    private _startIndicator: GlowingBox;
    private _finishIndicator: GlowingBox;

    private setupUserInterface() {
        this._cursorIndicator = new IndicatorBox(this, 0x00ff00, 0.3);

        this._ui.onLayoutRestart = this._ui.onGenerationChange = () => this.reset();

        this._ui.onMazeLoad = (start, finish) => {
            this.reset();

            this._start = start;
            this._startIndicator.position = this._positionConverter.nodeToBoxPosition(start).path;

            this._finish = finish;
            this._finishIndicator.position = this._positionConverter.nodeToBoxPosition(finish).path;

            this.generatePathAlgorithmSteps();
        };

        this._ui.onAlgorithmRestart = () => {
            this.clearAlgorithm();
        };

        this._ui.onStart = () => {
            this.clearAlgorithm();
            this.visualizeAlgorithm();
        };

        this._ui.onPathFindChange = () => {
            this.clearAlgorithm();
            this.generatePathAlgorithmSteps();
        };

        this._ui.onSave = () => {
            MazeSerializer.save(this._mazeFinder, this._ui.maze.size, this._start, this._finish);
        };
    }

    private clearAlgorithm() {
        this.clearAnimations();
        this.clearIndicators();
        this.setBoxesToInitialPosition(false);
    }

    private setupCameraAndLights(camera: OrthographicCamera) {
        const camLookAt = (dimension: number) =>
            ((dimension - 1) * (this._boxSize + this._gap)) / 2 + dimension / 4.5;

        const mazeDiagonal = this._ui.maze.diagonal;
        const camPos = mazeDiagonal * 4;
        const camSize = mazeDiagonal / 2.3;
        const lookAtX = camLookAt(this._ui.maze.size.x);
        const lookAtZ = camLookAt(this._ui.maze.size.y);

        // initial camera parameters
        camera.size = camSize;
        camera.lockAt = new Vector3(lookAtX, 0, lookAtZ);
        camera.threeObject.position.set(camPos, camPos, camPos);

        // general directional light
        const dirLight = new DirectionalLight(this, 0xffffff, 1);
        dirLight.threeObject.position.set(lookAtX, 25, lookAtZ / 4);
        dirLight.threeObject.lookAt(lookAtX, 0, lookAtZ);

        // light from above the maze for spotlight effect
        const pointLight = new PointLight(this, 0xffffff, mazeDiagonal * 80, mazeDiagonal / 1.4);
        pointLight.threeObject.position.set(lookAtX, mazeDiagonal / 2, lookAtZ);
    }

    private createBoxInstanceGroups() {
        const boxCount = this._ui.maze.area;
        const labels: LabelBox[] = [
            {
                label: 'candidate',
                color: 0xffff00,
                group: new LabelBoxGroup(this, boxCount, 0xffff00),
                emissive: new EmissiveBox(this, 0xffff00)
            },
            {
                label: 'forsaken',
                color: 0xff0000,
                group: new LabelBoxGroup(this, boxCount, 0xff0000),
                emissive: new EmissiveBox(this, 0xff0000)
            },
            {
                label: 'queued',
                color: 0xffa500,
                group: new LabelBoxGroup(this, boxCount, 0xffa500),
                emissive: new EmissiveBox(this, 0xffa500)
            },
            {
                label: 'selected',
                color: 0x00ff00,
                group: new LabelBoxGroup(this, boxCount, 0x00ff00),
                emissive: new EmissiveBox(this, 0x00ff00)
            },
            {
                label: 'default',
                color: 0x4c566a,
                group: new LabelBoxGroup(this, boxCount, 0x4c566a),
                emissive: new EmissiveBox(this, 0x4c566a)
            }
        ];

        labels.forEach(({ label, color, group, emissive }) => {
            this._labelGroups.set(label, { color, group, emissive });
        });
    }

    private createHitboxPlane() {
        const { x, y } = this._ui.maze.size;
        const plane = new Plane(this);
        const totalWidth = x + (x - 1) * this._gap;
        const totalHeight = y + (y - 1) * this._gap;

        plane.threeObject.position.set(
            totalWidth / 2 - this._boxSize,
            1,
            totalHeight / 2 - this._boxSize
        );
        plane.threeObject.scale.set(totalWidth, 1, totalHeight);
    }

    private generateRandomStartFinishPoints() {
        const { start, end } = this._maze.randomizeStartEndPositions();
        this._start = start;
        this._finish = end;
    }

    private createStartFinishBoxes() {
        if (!this._start || !this._finish) {
            console.error('Start and finish points are not set!');
            return;
        }

        const startVec = this._positionConverter.nodeToBoxPosition(this._start).path;
        const finishVec = this._positionConverter.nodeToBoxPosition(this._finish).path;

        this._startIndicator = new GlowingBox(this, startVec, 0xffffff);
        this._finishIndicator = new GlowingBox(this, finishVec, 0xffffff);
    }

    private generatePathAlgorithmSteps() {
        if (!this._start || !this._finish) {
            console.error('Start and finish points are not set!');
            return;
        }

        if (!this._mazeFinder) {
            console.error('Path finder is not initialized!');
            return;
        }

        this._steps = [];
        this._mazeFinder.findPath(this._ui.pathFindStrategy, this._start, this._finish);
    }

    private initPathFinder() {
        this._mazeFinder = this._maze.getMazePathFinder();
        this._mazeFinder.addNodeLabelChangeObserver(step => {
            if (step.node.hasLabel(step.labelChanged)) this._steps.push(step);
        });
    }

    private setBoxesToInitialPosition(playAnimation = true) {
        if (!this._mazeFinder) {
            console.error('Path finder is not initialized!');
            return;
        }

        this._boxNodes = [];
        this._mazeFinder.forEachNode(({ pos, node, i }) => {
            const { path, wall } = this._positionConverter.nodeToBoxPosition(pos);
            const defaultBoxGroup = this._labelGroups.get('default').group;

            this._labelGroups.forEach(label => {
                label.group.setInstancePosition(i, wall);
                label.emissive.threeObject.position.set(wall.x, wall.y, wall.z);
            });

            defaultBoxGroup.setInstancePosition(i, path);

            this._boxNodes.push({ pos, node, activeGroup: defaultBoxGroup, index: i });

            if (node.isColliding()) {
                if (playAnimation) {
                    setTimeout(
                        () => playGroupFallAnimation(this, defaultBoxGroup, i),
                        Random.randomInt(100, 1000)
                    );
                } else {
                    defaultBoxGroup.setInstancePosition(i, wall);
                }
            }
        });
    }

    private spawnMaze() {
        this._maze = new MazeFacade();
        this._maze.setGeneratorStrategy(this._ui.generationStrategy);
        this._maze.generateMaze(this._ui.maze.size);

        this.initPathFinder();
        this.setBoxesToInitialPosition();
        this.generateRandomStartFinishPoints();
        this.generatePathAlgorithmSteps();
    }

    private clearIndicators() {
        if (this._lightIndicator) this._lightIndicator.delete();
        if (this._cursorIndicator) this._cursorIndicator.delete();
    }

    private visualizeAlgorithm() {
        this._lightIndicator = new PointLight(this, 0xff00ff, 20);
        const steps = [...this._steps].reverse();

        steps.reduce(
            (next, { pos, labelChanged, node }) => {
                return () => {
                    if (node.hasLabel('start') || node.hasLabel('finish')) {
                        return next();
                    }

                    const { path, wall, abovePath } =
                        this._positionConverter.nodeToBoxPosition(pos);

                    const { group, color, emissive } = this._labelGroups.get(labelChanged);
                    const currentNode = this._boxNodes.find(node => node.pos.equals(pos));
                    const oldGroup = currentNode.activeGroup;
                    const boxIndex = currentNode.index;

                    this._labelGroups.forEach(label =>
                        label.emissive.threeObject.position.set(wall.x, wall.y, wall.z)
                    );

                    this._lightIndicator.threeObject.color.set(color);
                    this._lightIndicator.threeObject.position.set(
                        abovePath.x,
                        abovePath.y,
                        abovePath.z
                    );
                    emissive.threeObject.position.set(path.x, path.y, path.z);

                    group.setInstancePosition(boxIndex, path);
                    oldGroup.setInstancePosition(boxIndex, wall);

                    this._boxNodes[boxIndex] = { node, activeGroup: group, pos, index: boxIndex };

                    playBoxSpawnAnimation(this, emissive, next);
                };
            },
            () => {
                this.clearIndicators();
            }
        )();
    }

    private handleMouse(mouse: Mouse) {
        const isInstancedMesh = (obj: ThreeObject): obj is InstancedMesh => {
            return (obj as InstancedMesh)?.isInstancedMesh !== undefined;
        };

        const isHitboxPlane = (obj: ThreeObject): obj is Mesh => {
            return (obj as Mesh)?.isMesh !== undefined;
        };

        this._cursorIndicator.threeObject.position.set(0, -1000, 0);

        const up = new Vector3(0, 1, 0);
        const mazeSize = this._ui.maze.size;

        const planeIntersection = mouse.intersects.find(i => isHitboxPlane(i.object));
        const boxIntersection = mouse.intersects.find(i => isInstancedMesh(i.object));

        if (boxIntersection && boxIntersection.normal.equals(up) && mouse.buttonDown === 'right') {
            const hoverObject = boxIntersection.object;
            const instanceIndex = boxIntersection.instanceId;
            const group = Array.from(this._labelGroups)
                .map(group => group[1].group)
                .find(group => group.threeObject == hoverObject);

            const boxPos = group.getInstancePosition(instanceIndex);
            const nodePos = this._positionConverter.boxToNodePosition(boxPos);
            const box = this._boxNodes.find(boxNode => boxNode.pos.equals(nodePos));

            if (!box.pos.equals(this._start) && !box.pos.equals(this._finish)) {
                const newPos = this._positionConverter.boxToBoxPosition(boxPos, 'wall');
                group.setInstancePosition(instanceIndex, newPos);
                box.node.makeColliding();
                this.generatePathAlgorithmSteps();
            }
        }

        if (planeIntersection) {
            const point = planeIntersection.point;
            const nodePos = this._positionConverter.pointToNodePosition(point, mazeSize);
            const boxPos = this._positionConverter.pointToBoxPosition(point, mazeSize);

            if (!boxPos || !nodePos || nodePos.equals(this._start) || nodePos.equals(this._finish))
                return;

            this._cursorIndicator.threeObject.position.set(
                boxPos.path.x,
                boxPos.path.y,
                boxPos.path.z
            );

            if (mouse.buttonDown === 'left') {
                const box = this._boxNodes.find(node => node.pos.equals(nodePos));
                box.activeGroup.setInstancePosition(box.index, boxPos.path);
                box.node.makeNotColliding();
                this.generatePathAlgorithmSteps();
            }

            if (mouse.buttonDown === 'left' && mouse.buttonModifiers.shift) {
                this._startIndicator.position = boxPos.path;
                this._start = nodePos;
                this.generatePathAlgorithmSteps();
            }

            if (mouse.buttonDown === 'left' && mouse.buttonModifiers.ctrl) {
                this._finishIndicator.position = boxPos.path;
                this._finish = nodePos;
                this.generatePathAlgorithmSteps();
            }
        }
    }

    override start({ camera, renderer }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this.setupCameraAndLights(camera);
        this.setupUserInterface();
        this.createBoxInstanceGroups();
        this.createHitboxPlane();
        this.spawnMaze();
        this.createStartFinishBoxes();
    }

    override loop({ mouse }: LoopArgs): void {
        this.handleMouse(mouse);
    }
}
