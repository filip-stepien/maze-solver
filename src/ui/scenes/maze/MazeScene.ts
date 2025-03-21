import { Vec2d } from '../../../types';
import { LoopArgs, Scene, StartArgs } from '../../core/Scene';
import { MazeFacade } from '../../../maze/god';
import { OrthographicCamera } from '../../core/OrthographicCamera';
import { InstancedMesh, Object3D as ThreeObject, Vector3 } from 'three';
import { PrimsStrategy } from '../../../strategies/PrimsStrategy';
import { Random } from '../../../utils/Random';
import { Button } from '../../controls/Button';
import { NumberInput } from '../../controls/NumberInput';
import { PointLight } from '../../core/PointLight';
import { DirectionalLight } from '../../core/DirectionalLight';
import { Renderer } from '../../core/Renderer';
import { MPFLabelChangeCallbackParams } from '../../../maze/MazePathFinder';
import { GlowingBox } from './models/GlowingBox';
import { LabelBoxGroup } from './models/LabelBoxGroup';
import playBoxSpawnAnimation from './animations/playBoxSpawnAnimation';
import playGroupFallAnimation from './animations/playGroupFallAnimation';
import { ModelGroup } from '../../core/ModelGroup';
import { MazePathFinderNodeLabel } from '../../../maze/MazePathFinderNode';
import { AStarStrategy } from '../../../strategies/MazePathFindStrategy/AStarStrategy';
import { EmissiveBox } from './models/EmissiveBoxGroup';
import { Mouse } from '../../core/Mouse';
import playGroupSpawnAnimation from './animations/playGroupSpawnAnimation';

type BoxNode = { pos: Vec2d; activeGroup: ModelGroup; index: number };
type LabelGroup = MazePathFinderNodeLabel | 'default';
type LabelBox = { label?: LabelGroup; group: ModelGroup; color: number; emissive: EmissiveBox };

export class MazeScene extends Scene {
    private _generationStrategy = new PrimsStrategy();
    private _pathFindStrategy = new AStarStrategy();
    private _mazeSize = new Vec2d([10, 10]);
    private _sizeInputX = new NumberInput();
    private _sizeInputY = new NumberInput();
    private _resetButton = new Button('Reset');
    private _startButton = new Button('Start');
    private _gap = 0.2;
    private _boxNodes: BoxNode[] = [];
    private _labelGroups = new Map<LabelGroup, LabelBox>();

    private getBoxPositions(pos: Vec2d) {
        const toBoxPos = (dimension: number) =>
            dimension * LabelBoxGroup.boxSize * 2 * (1 + this._gap);

        return {
            active: new Vector3(toBoxPos(pos.x), 0, toBoxPos(pos.y)),
            inactive: new Vector3(toBoxPos(pos.x), 1000, toBoxPos(pos.y)),
            up: new Vector3(toBoxPos(pos.x), 1, toBoxPos(pos.y))
        };
    }

    private setupCameraAndLights(camera: OrthographicCamera) {
        const camLookAt = (dimension: number) =>
            ((dimension - 1) * (LabelBoxGroup.boxSize + this._gap)) / 2 + dimension / 4.5;

        const mazeDiagonal = Math.sqrt(this._mazeSize.x ** 2 + this._mazeSize.y ** 2);
        const camPos = mazeDiagonal * 4;
        const camSize = mazeDiagonal / 2.3;
        const lookAtX = camLookAt(this._mazeSize.x);
        const lookAtZ = camLookAt(this._mazeSize.y);

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

    private handleResetButton(renderer: Renderer) {
        this._resetButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true)) {
                this._boxNodes = [];
                this._startButton.disabled = false;
                this.reset(renderer);
            }
        };
    }

    private handleStartButton(steps: MPFLabelChangeCallbackParams[]) {
        this._startButton.onChange = () => {
            this.visualizeAlgorithm(steps);
            this._startButton.disabled = true;
        };
    }

    private handleNumberInput() {
        this._sizeInputX.value = 10;
        this._sizeInputX.min = 3;
        this._sizeInputX.max = 100;

        this._sizeInputY.value = 10;
        this._sizeInputY.min = 3;
        this._sizeInputY.max = 100;

        this._sizeInputX.onChange = value => {
            this._mazeSize.x = parseInt(value);
        };

        this._sizeInputY.onChange = value => {
            this._mazeSize.y = parseInt(value);
        };
    }

    private createBoxInstanceGroups() {
        const boxCount = this._mazeSize.x * this._mazeSize.y;
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

    private createStartFinishBoxes(startPos: Vec2d, finishPos: Vec2d) {
        const startVec = this.getBoxPositions(startPos).active;
        const endVec = this.getBoxPositions(finishPos).active;

        new GlowingBox(this, startVec, 0xffffff);
        new GlowingBox(this, endVec, 0xffffff);
    }

    private spawnMaze(animateWalls: boolean = true) {
        const maze = new MazeFacade();
        maze.setGeneratorStrategy(this._generationStrategy);
        maze.generateMaze(this._mazeSize);

        const mazeFinder = maze.getMazePathFinder();
        const { start, end } = maze.randomizeStartEndPositions();

        const steps: MPFLabelChangeCallbackParams[] = [];
        mazeFinder.addNodeLabelChangeObserver(step => {
            if (step.node.hasLabel(step.labelChanged)) steps.push(step);
        });

        mazeFinder.findPath(this._pathFindStrategy, start, end);

        mazeFinder.forEachNode(({ pos, node, i }) => {
            const { active, inactive } = this.getBoxPositions(pos);
            const defaultBoxGroup = this._labelGroups.get('default').group;

            this._labelGroups.forEach(label => label.group.setInstancePosition(i, inactive));
            defaultBoxGroup.setInstancePosition(i, active);

            this._boxNodes.push({ pos, activeGroup: defaultBoxGroup, index: i });

            if (node.isColliding() && animateWalls) {
                setTimeout(
                    () => playGroupFallAnimation(this, defaultBoxGroup, i),
                    Random.randomInt(100, 1000)
                );
            }
        });

        return { start, end, steps };
    }

    private visualizeAlgorithm(steps: MPFLabelChangeCallbackParams[]) {
        const lightIndicator = new PointLight(this, 0xff00ff, 20);

        steps.reverse().reduce(
            (next, { pos, labelChanged, node }) => {
                return () => {
                    if (node.hasLabel('start') || node.hasLabel('finish')) {
                        return next();
                    }

                    const { active, inactive, up } = this.getBoxPositions(pos);
                    const { group, color, emissive } = this._labelGroups.get(labelChanged);
                    const currentNode = this._boxNodes.find(node => node.pos.equals(pos));
                    const oldGroup = currentNode.activeGroup;
                    const boxIndex = currentNode.index;

                    this._labelGroups.forEach(label =>
                        label.emissive.threeObject.position.set(inactive.x, inactive.y, inactive.z)
                    );

                    lightIndicator.threeObject.color.set(color);
                    lightIndicator.threeObject.position.set(up.x, up.y, up.z);
                    emissive.threeObject.position.set(active.x, active.y, active.z);

                    group.setInstancePosition(boxIndex, active);
                    oldGroup.setInstancePosition(boxIndex, inactive);

                    this._boxNodes[boxIndex] = { activeGroup: group, pos, index: boxIndex };

                    playBoxSpawnAnimation(this, emissive, next);
                };
            },
            () => {}
        )();
    }

    private handleMouse(mouse: Mouse) {
        const isInstancedMesh = (obj: ThreeObject): obj is InstancedMesh => {
            return (obj as InstancedMesh).isInstancedMesh !== undefined;
        };

        const intersection = mouse.intersects[0];
        const hoverObject = intersection?.object;
        const instanceIndex = intersection?.instanceId;

        if (hoverObject && isInstancedMesh(hoverObject) && mouse.buttonDown === 'left') {
            const group = Array.from(this._labelGroups)
                .map(group => group[1].group)
                .find(group => group.threeObject == hoverObject);

            playGroupFallAnimation(this, group, instanceIndex);
        }
    }

    override start({ camera, renderer, mouse }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this.setupCameraAndLights(camera);
        this.handleNumberInput();
        this.handleResetButton(renderer);

        this.createBoxInstanceGroups();
        const { start, end, steps } = this.spawnMaze(false);
        this.createStartFinishBoxes(start, end);
        this.handleStartButton(steps);
    }

    override loop({ mouse }: LoopArgs): void {
        this.handleMouse(mouse);
    }
}
