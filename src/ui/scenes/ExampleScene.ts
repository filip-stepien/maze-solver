import { MazeBox } from '../models/MazeBox';
import { Scene } from '../core/Scene';
import { Camera, Vector3 } from 'three';

export class ExampleScene extends Scene {
    private _boxes: MazeBox[] = [];
    private _angle: number = 0;

    override start(): void {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const box = new MazeBox(this);
                box.threeObject.position.x = i * 0.25;
                box.threeObject.position.z = j * 0.25;
                this._boxes.push(box);
            }
        }
    }

    override loop(camera: Camera, delta: number): void {
        const radius = 2;
        const centerX = (3 * 0.25) / 2;
        const centerZ = (3 * 0.25) / 2;

        this._angle += delta * 0.5;

        camera.position.x = centerX + radius * Math.cos(this._angle);
        camera.position.z = centerZ + radius * Math.sin(this._angle);
        camera.position.y = 1.5;

        camera.lookAt(new Vector3(centerX, 0, centerZ));
    }
}
