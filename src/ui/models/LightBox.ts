import {
    Material,
    BufferGeometry,
    BoxGeometry,
    MeshStandardMaterial,
    MeshBasicMaterial
} from 'three';
import { Scene } from '../core/Scene';
import { Model3D } from '../core/Model3D';

export class LightBox extends Model3D {
    private _color: number;

    constructor(scene: Scene, color: number = 0xffffff) {
        super(scene);
        this._color = color;
    }

    protected materialFactory(): Material {
        return new MeshBasicMaterial({ color: this._color });
    }

    protected geometryFactory(): BufferGeometry {
        return new BoxGeometry(1.001, 1.001, 1.001);
    }
}
