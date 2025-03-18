import { Material, BufferGeometry, BoxGeometry, MeshBasicMaterial } from 'three';
import { Model3D } from '../../../core/Model3D';
import { Scene } from '../../../core/Scene';

export class EmissiveBox extends Model3D {
    private _color: number;

    constructor(scene: Scene, color: number = 0xffffff) {
        super(scene);
        this._color = color;
    }

    protected materialFactory(): Material {
        return new MeshBasicMaterial({
            color: this._color
        });
    }

    protected geometryFactory(): BufferGeometry {
        return new BoxGeometry(1.001, 1.001, 1.001);
    }
}
