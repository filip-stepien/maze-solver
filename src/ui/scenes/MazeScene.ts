import { Vec2d } from '../../types';
import { LoopArgs, Scene, StartArgs } from '../core/Scene';
import { MazeFacade } from '../../maze/god';
import { OrthographicCamera } from '../core/OrthographicCamera';
import { Vector3 } from 'three';
import { GenerationStrategy } from '../../strategies/GenerationStrategy';
import { PrimsStrategy } from '../../strategies/PrimsStrategy';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Random } from '../../utils/Random';
import { Button } from '../controls/Button';
import { MazeBoxGroup } from '../models/MazeBoxGroup';
import { BezierAnimation } from '../core/BezierAnimation';
import { NumberInput } from '../controls/NumberInput';
import { PointLight } from '../core/PointLight';
import { DirectionalLight } from '../core/DirectionalLight';
import { AmbientLight } from '../core/AmbientLight';
import { LightBox } from '../models/LightBox';

export class MazeScene extends Scene {
    private _maze: MazeFacade;
    private _generationStrategy: GenerationStrategy;
    private _mazeSize: Vec2d;
    private _mazeFinder: MazePathFinder<MazePathFinderNode>;
    private _resetButton: Button;
    private _sizeInputX: NumberInput;
    private _sizeInputY: NumberInput;
    private _boxGroup: MazeBoxGroup;
    private _gap: number;

    private _pointLight: PointLight;
    private _dirLight: DirectionalLight;
    private _ambientLight: AmbientLight;

    constructor() {
        super();
        this._mazeSize = new Vec2d([10, 10]);
        this._maze = new MazeFacade();
        this._generationStrategy = new PrimsStrategy();
        this._sizeInputX = new NumberInput();
        this._sizeInputY = new NumberInput();
        this._resetButton = new Button('Reset');
        this._gap = 0.2;

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

    private generateMazeBoxGroupes() {
        this._maze.setGeneratorStrategy(this._generationStrategy);
        this._maze.generateMaze(this._mazeSize);
        this._mazeFinder = this._maze.getMazePathFinder();
        this._boxGroup = new MazeBoxGroup(this, this._mazeSize.x * this._mazeSize.y);

        this._mazeFinder.forEachNode(({ pos, node, i }) => {
            const renderPos = new Vector3(
                pos.x * MazeBoxGroup.boxSize * 2 * (1 + this._gap),
                0,
                pos.y * MazeBoxGroup.boxSize * 2 * (1 + this._gap)
            );

            if (i == 24) {
                const lPos = renderPos.clone();

                this._boxGroup.setInstancePosition(i, new Vector3(lPos.x, lPos.y, lPos.z));

                const light = new LightBox(this);
                light.threeObject.position.x = lPos.x;
                light.threeObject.position.y = lPos.y;
                light.threeObject.position.z = lPos.z;

                const point1 = new PointLight(this, 0xffffff, 20, 0);
                point1.threeObject.position.x = lPos.x;
                point1.threeObject.position.y = lPos.y;
                point1.threeObject.position.z = lPos.z;

                const point2 = new PointLight(this, 0xffffff, 20, 0);
                point2.threeObject.position.x = lPos.x;
                point2.threeObject.position.y = lPos.y + 1;
                point2.threeObject.position.z = lPos.z;
            } else {
                this._boxGroup.setInstancePosition(i, renderPos);
            }

            if (node.isColliding()) {
                // setTimeout(() => {
                //     new BezierAnimation(this)
                //         .setStartVector(renderPos)
                //         .setEndVector(new Vector3(renderPos.x, -150, renderPos.z))
                //         .setDuration(1)
                //         .setEasing(0.01)
                //         .setCallback(vec => this._boxGroup.setInstancePosition(i, vec))
                //         .setDoneCallback(() => (this._resetButton.disabled = false))
                //         .start();
                // }, Random.randomInt(100, 1000));
            }
        });
    }

    private setupCamera(camera: OrthographicCamera) {
        const boxSize = MazeBoxGroup.boxSize;
        const diagonal = Math.sqrt(Math.pow(this._mazeSize.x, 2) + Math.pow(this._mazeSize.y, 2));
        const centerX =
            ((this._mazeSize.x - 1) * (boxSize + this._gap)) / 2 + this._mazeSize.x / 4.5;
        const centerZ =
            ((this._mazeSize.y - 1) * (boxSize + this._gap)) / 2 + this._mazeSize.y / 4.5;
        const position = diagonal * 4;
        const size = diagonal / 2.3;

        camera.threeObject.position.x = position;
        camera.threeObject.position.y = position;
        camera.threeObject.position.z = position;

        const dir2 = new DirectionalLight(this, 0xffffff, 1);
        dir2.threeObject.position.x = centerX;
        dir2.threeObject.position.y = 25;
        dir2.threeObject.position.z = centerZ / 4;
        dir2.threeObject.lookAt(centerZ, 0, centerX);

        camera.size = size;
        camera.lockAt = new Vector3(centerX, 0, centerZ);
    }

    override start({ camera, renderer }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this._resetButton.disabled = true;
        this._resetButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true))
                this.reset(renderer);
        };

        this.generateMazeBoxGroupes();
        this.setupCamera(camera);
    }

    override loop({ camera }: LoopArgs): void {
        //this._boxGroup.threeObject.rotation.y += 0.01;
    }
}
