import { Vec2d } from '../../types';
import { LoopArgs, Scene, StartArgs } from '../core/Scene';
import { MazeFacade } from '../../maze/god';
import { OrthographicCamera } from '../core/OrthographicCamera';
import { Vector3 } from 'three';
import { Renderer } from '../core/Renderer';
import { GenerationStrategy } from '../../strategies/GenerationStrategy';
import { PrimsStrategy } from '../../strategies/PrimsStrategy';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Random } from '../../utils/Random';
import { Button } from '../controls/Button';
import { MazeBoxGroup } from '../models/MazeBoxGroup';

export class MazeScene extends Scene {
    private _maze: MazeFacade;
    private _generationStrategy: GenerationStrategy;
    private _mazeSize: Vec2d;
    private _mazeFinder: MazePathFinder<MazePathFinderNode>;
    private _resetButton: Button;
    private _boxGroup: MazeBoxGroup;
    private _gap: number;

    constructor() {
        super();
        this._mazeSize = new Vec2d([100, 100]);
        this._maze = new MazeFacade();
        this._generationStrategy = new PrimsStrategy();
        this._resetButton = new Button('Reset');
        this._gap = 0.2;
    }

    private generateMazeBoxGroupes() {
        this._maze.setGeneratorStrategy(this._generationStrategy);
        this._maze.generateMaze(this._mazeSize);
        this._mazeFinder = this._maze.getMazePathFinder();
        this._boxGroup = new MazeBoxGroup(this, this._mazeSize.x * this._mazeSize.y);

        this._mazeFinder.forEachNode(({ pos, node, i }) => {
            const renderPos = new Vec2d({
                x: pos.x * MazeBoxGroup.boxSize * 2 * (1 + this._gap),
                y: pos.y * MazeBoxGroup.boxSize * 2 * (1 + this._gap)
            });

            this._boxGroup.setInstancePosition(i, new Vector3(renderPos.x, 0, renderPos.y));

            if (node.isColliding()) {
                setTimeout(() => {
                    this.animatePosition(
                        this._boxGroup,
                        new Vector3(renderPos.x, -200, renderPos.y),
                        5,
                        i
                    );
                }, Random.randomInt(100, 1000));
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

        camera.threeCamera.position.x = position;
        camera.threeCamera.position.y = position;
        camera.threeCamera.position.z = position;

        camera.size = size;
        camera.lockAt = new Vector3(centerX, 0, centerZ);
    }

    override start({ camera }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this._resetButton.onChange = () => {
            this.generateMazeBoxGroupes();
        };

        this.generateMazeBoxGroupes();
        this.setupCamera(camera);
        //this.animatePosition(camera, new Vector3(200, 100, 120), 5);
    }

    override loop({ camera }: LoopArgs): void {
        //this._boxGroup.threeObject.rotation.y += 0.01;
    }
}
