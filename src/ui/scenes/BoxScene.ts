import { MazeBox } from '../models/MazeBox';
import { Scene } from '../core/Scene';

export class BoxScene extends Scene {
    private _box = new MazeBox(this);

    override start(): void {
        this._box.mesh.position.x = (3 * 0.25) / 2;
        this._box.mesh.position.y = 0.5;
        this._box.mesh.position.z = (3 * 0.25) / 2;
    }

    override loop(): void {
        this._box.mesh.rotation.y += 0.01;
    }
}
