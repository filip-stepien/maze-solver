import { Vec2d } from '../../types';
import { LoopArgs, Scene, StartArgs } from '../core/Scene';
import { MazeFacade } from '../../maze/god';
import { OrthographicCamera } from '../core/OrthographicCamera';
import { Vector3 } from 'three';
import { PrimsStrategy } from '../../strategies/PrimsStrategy';
import { Random } from '../../utils/Random';
import { Button } from '../controls/Button';
import { MazeBoxGroup } from '../models/MazeBoxGroup';
import { NumberInput } from '../controls/NumberInput';
import { PointLight } from '../core/PointLight';
import { DirectionalLight } from '../core/DirectionalLight';
import { LightBox } from '../models/LightBox';
import { LinearAnimation } from '../core/LinearAnimation';
import { Renderer } from '../core/Renderer';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { BFSStrategy } from '../../strategies/MazePathFindStrategy/BFSStrategy';

export class MazeScene extends Scene {
    private _generationStrategy = new PrimsStrategy();
    private _mazeSize = new Vec2d([10, 10]);
    private _sizeInputX = new NumberInput();
    private _sizeInputY = new NumberInput();
    private _resetButton = new Button('Reset');
    private _gap = 0.2;

    private createGlowingBox(pos: Vector3, color: number = 0xffffff) {
        const light = new LightBox(this, color);
        const point1 = new PointLight(this, color, 0);
        const point2 = new PointLight(this, color, 0);
        const { x, y, z } = pos;

        // create light box and point lights to imitate glowing
        // one light is positioned inside light box,
        // other one is little above
        light.threeObject.position.set(x, y, z);
        point1.threeObject.position.set(x, y, z);
        point2.threeObject.position.set(x, y + 1, z);

        // light pop animation
        new LinearAnimation(this)
            .setStartVector(new Vector3(0))
            .setEndVector(new Vector3(30))
            .setDuration(0.2)
            .setCallback(vec => (point1.threeObject.intensity = vec.x))
            .setDoneCallback(() => {
                new LinearAnimation(this)
                    .setStartVector(new Vector3(30))
                    .setEndVector(new Vector3(10))
                    .setDuration(0.2)
                    .setCallback(vec => (point1.threeObject.intensity = vec.x))
                    .start();
            })
            .start();

        // cube pop animation
        new LinearAnimation(this)
            .setStartVector(new Vector3(1, 1, 1))
            .setEndVector(new Vector3(1.15, 1.15, 1.15))
            .setDuration(0.2)
            .setCallback(({ x, y, z }) => light.threeObject.scale.set(x, y, z))
            .setDoneCallback(() => {
                new LinearAnimation(this)
                    .setStartVector(new Vector3(1.15, 1.15, 1.15))
                    .setEndVector(new Vector3(1, 1, 1))
                    .setDuration(0.2)
                    .setCallback(({ x, y, z }) => light.threeObject.scale.set(x, y, z))
                    .start();
            })
            .start();
    }

    private setupCameraAndLights(camera: OrthographicCamera) {
        const camLookAt = (dimension: number) =>
            ((dimension - 1) * (MazeBoxGroup.boxSize + this._gap)) / 2 + dimension / 4.5;

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
        this._resetButton.disabled = true;
        this._resetButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true)) {
                this.reset(renderer);
            }
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

    private generateMazeBoxes() {
        const maze = new MazeFacade();
        maze.setGeneratorStrategy(this._generationStrategy);
        maze.generateMaze(this._mazeSize);

        const mazeFinder = maze.getMazePathFinder();
        const boxGroup = new MazeBoxGroup(this, this._mazeSize.x * this._mazeSize.y);
        const boxPos = (dimension: number) =>
            dimension * MazeBoxGroup.boxSize * 2 * (1 + this._gap);

        // spawn maze
        mazeFinder.forEachNode(({ pos, node, i }) => {
            const boxPosVec = new Vector3(boxPos(pos.x), 0, boxPos(pos.y));
            boxGroup.setInstancePosition(i, boxPosVec);

            if (node.isColliding()) {
                // falling animation
                setTimeout(() => {
                    new LinearAnimation(this)
                        .setStartVector(boxPosVec)
                        .setEndVector(new Vector3(boxPosVec.x, -150, boxPosVec.z))
                        .setDuration(1)
                        .setEasing(0.1)
                        .setCallback(vec => boxGroup.setInstancePosition(i, vec))
                        .setDoneCallback(() => (this._resetButton.disabled = false))
                        .start();
                }, Random.randomInt(100, 1000));
            }
        });

        // spawn start and end point of the maze
        const { start, end } = maze.randomizeStartEndPositions();
        const startVec = new Vector3(boxPos(start.x), 0, boxPos(start.y));
        const endVec = new Vector3(boxPos(end.x), 0, boxPos(end.x));
        this.createGlowingBox(startVec);
        this.createGlowingBox(endVec, 0xff0000);

        mazeFinder.addNodeLabelChangeObserver(console.log);
        mazeFinder.findPath(new BFSStrategy(), start, end);
    }

    override start({ camera, renderer }: StartArgs): void {
        if (!OrthographicCamera.isOrthographic(camera))
            throw new Error('This scene needs an orthographic camera to work properly!');

        this.setupCameraAndLights(camera);
        this.handleNumberInput();
        this.handleResetButton(renderer);
        this.generateMazeBoxes();
    }
}
