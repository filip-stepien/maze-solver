import { Material, BufferGeometry, PlaneGeometry, MeshStandardMaterial } from 'three';
import { Scene } from '../../../core/Scene';
import { Model3D } from '../../../core/Model3D';

export class Plane extends Model3D {
    private _color: number;
    private _opacity: number;

    constructor(scene: Scene, color?: number, opacity?: number) {
        super(scene);
        this._color = color ?? 0;
        this._opacity = opacity ?? 1;
    }

    protected materialFactory(): Material {
        return new MeshStandardMaterial({
            transparent: true,
            opacity: this._color ? this._opacity : 0,
            color: this._color
        });
    }

    protected geometryFactory(): BufferGeometry {
        const geometry = new PlaneGeometry();
        geometry.rotateX(-Math.PI / 2);
        return geometry;
    }
}
