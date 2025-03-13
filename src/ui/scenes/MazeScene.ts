import { loop } from 'three/src/Three.TSL';
import { Maze } from '../../maze/Maze';
import { MazeGenerator } from '../../maze/MazeGenerator';
import { MazeNode } from '../../maze/MazeNode';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { PrimsStrategy } from '../../strategies/PrimsStrategy';
import { Vec2d } from '../../types';
import { Random } from '../../utils/Random';
import { LoopArgs, Scene, StartArgs } from '../core/Scene';
import { MazeBox } from '../models/MazeBox';
import { DFSStrategy } from '../../strategies/MazePathFindStrategy/DFSStrategy';
import { BoxScene } from './BoxScene';
import { OrthographicCamera } from '../core/OrthographicCamera';
import { Vector3 } from 'three';
import { RangeSlider } from '../controls/RangeSlider';

function randomizeStartEndPositions(maze: Maze<MazeNode>): { start: Vec2d; end: Vec2d } {
    const nonColliding: Vec2d[] = [];

    maze.forEachNode(({ pos, node }) => {
        if (!node.isColliding()) {
            nonColliding.push(pos);
        }
    });

    const start = nonColliding[Random.randomIndex(nonColliding)];

    let end: Vec2d;
    do {
        end = nonColliding[Random.randomIndex(nonColliding)];
    } while (JSON.stringify(start) === JSON.stringify(end));

    return {
        start,
        end
    };
}

function generateMaze(size: Vec2d) {
    const generator = new MazeGenerator(size.x, size.y);
    const strategy = new PrimsStrategy();
    generator.setGenerationStrategy(strategy);
    const colsate = generator.generateMaze().map(row => {
        return row.map(e => e != 0);
    });

    const maze = new MazePathFinder({
        collsionState: colsate,
        nodeFactory: () => {
            return new MazePathFinderNode();
        }
    });
    const { start, end } = randomizeStartEndPositions(maze);

    return { maze, start, end };
}

export class MazeScene extends Scene {
    private _maze: MazePathFinder<MazePathFinderNode>;
    private _slider: RangeSlider;

    constructor() {
        super();

        this._slider = new RangeSlider();
        this._slider.min = 1;
        this._slider.max = 10;
        this._slider.step = 0.1;

        const { maze, start, end } = generateMaze(new Vec2d({ x: 11, y: 11 }));
        this._maze = maze;
        this._maze.getNode(start).makeStart();
        this._maze.getNode(end).makeFinish();

        // this._maze.setPathFindStrategy(new DFSStrategy());

        // this._maze.addNodeLabelChangeObserver(console.log);

        // this._maze.findPath(start, end);
    }

    override start({ renderer, camera }: StartArgs): void {
        if (OrthographicCamera.isOrthographic(camera)) {
            this._slider.onChange = value => {
                camera.size = parseFloat(value);
            };

            const gap = 0.2;

            this._maze.forEachNode(({ pos }) => {
                const box = new BoxScene();
                const renderPos = new Vec2d({
                    x: pos.x * BoxScene.size * (1 + gap),
                    y: pos.y * BoxScene.size * (1 + gap)
                });

                box.position = renderPos;
                renderer.addScene(box);
                this.animatePosition(
                    box.objects[0],
                    new Vector3(renderPos.x, 1, renderPos.y),
                    Random.randomFloat(1, 2)
                );
            });

            const center = (11 * BoxScene.size) / 2 - BoxScene.size / 2;

            camera.size = 5;
            this._slider.value = camera.size;

            camera.threeCamera.position.x = 100;
            camera.threeCamera.position.y = 100;
            camera.threeCamera.position.z = 100;

            camera.lockAt = new Vector3(center, 0, center);
            this.animatePosition(camera, new Vector3(200, 100, 120), 5);
        }
    }

    override loop({ camera }: LoopArgs): void {}
}
