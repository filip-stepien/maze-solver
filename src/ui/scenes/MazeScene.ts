import { Vec2d } from '../../types';
import { LoopArgs, Scene, StartArgs } from '../core/Scene';
import { MazeFacade } from '../../maze/god';
import { OrthographicCamera } from '../core/OrthographicCamera';
import { BoxScene } from './BoxScene';
import { Vector3 } from 'three';
import { Renderer } from '../core/Renderer';
import { GenerationStrategy } from '../../strategies/GenerationStrategy';
import { PrimsStrategy } from '../../strategies/PrimsStrategy';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Camera3D } from '../core/Camera3D';
import { Random } from '../../utils/Random';
import { Button } from '../controls/Button';

export class MazeScene extends Scene {
    private _maze: MazeFacade;
    private _generationStrategy: GenerationStrategy;
    private _mazeSize: Vec2d;
    private _mazeFinder: MazePathFinder<MazePathFinderNode>;
    private _resetButton: Button;

    constructor() {
        super();
        this._mazeSize = new Vec2d([101, 101]);
        this._maze = new MazeFacade();
        this._generationStrategy = new PrimsStrategy();
        this._resetButton = new Button('Reset');
    }

    private generateMazeBoxes(renderer: Renderer, gap: number = 0.2) {
        this._maze.setGeneratorStrategy(this._generationStrategy);
        this._maze.generateMaze(this._mazeSize);
        this._mazeFinder = this._maze.getMazePathFinder();

        this._mazeFinder.forEachNode(({ pos, node }) => {
            const box = new BoxScene();
            const renderPos = new Vec2d({
                x: pos.x * BoxScene.size * (1 + gap),
                y: pos.y * BoxScene.size * (1 + gap)
            });

            box.position = renderPos;
            renderer.addScene(box);

            if (node.isColliding()) {
                setTimeout(() => {
                    this.animatePosition(
                        box.objects[0],
                        new Vector3(renderPos.x, -100, renderPos.y),
                        5
                    );
                }, Random.randomInt(100, 1000));
            }
        });
    }

    private setupCamera(camera: OrthographicCamera) {
        const centerX = (this._mazeSize.x * BoxScene.size) / 2 - BoxScene.size / 2 + BoxScene.size;
        const centerZ = (this._mazeSize.y * BoxScene.size) / 2 - BoxScene.size / 2 + BoxScene.size;
        const diagonal = Math.sqrt(Math.pow(this._mazeSize.x, 2) + Math.pow(this._mazeSize.y, 2));
        const position = diagonal * 4;
        const size = diagonal / 4;

        camera.threeCamera.position.x = position;
        camera.threeCamera.position.y = position;
        camera.threeCamera.position.z = position;

        camera.size = size;
        camera.lockAt = new Vector3(centerX, 0, centerZ);
    }

    override start({ renderer, camera }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this._resetButton.onChange = () => {
            this.generateMazeBoxes(renderer);
        };

        this.generateMazeBoxes(renderer);
        this.setupCamera(camera);
        //this.animatePosition(camera, new Vector3(200, 100, 120), 5);
    }

    override loop({ camera }: LoopArgs): void {}
}
