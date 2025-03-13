import { MazeBox } from '../models/MazeBox';
import { Scene, StartArgs } from '../core/Scene';
import { Vec2d } from '../../types';
import { Vector3 } from 'three';

export class BoxScene extends Scene {
    private _box: MazeBox;

    constructor() {
        super();
        this._box = new MazeBox(this);
    }

    public set position(position: Vec2d) {
        this._box.threeObject.position.x = position.x;
        this._box.threeObject.position.z = position.y;
    }

    public get position(): Vec2d {
        return new Vec2d({
            x: this._box.threeObject.position.x,
            y: this._box.threeObject.position.z
        });
    }

    public static get size() {
        return MazeBox.size;
    }

    override start(): void {}
}
