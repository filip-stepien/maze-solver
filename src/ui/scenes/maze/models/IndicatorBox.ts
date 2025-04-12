import {
    Material,
    BufferGeometry,
    MeshStandardMaterial,
    PlaneGeometry,
    BoxGeometry,
    MeshBasicMaterial,
    ShaderMaterial
} from 'three';
import { Scene } from '../../../core/Scene';
import { Model3D } from '../../../core/Model3D';

export class IndicatorBox extends Model3D {
    private _color: number;
    private _opacity: number;

    constructor(scene: Scene, color: number, opacity?: number) {
        super(scene);
        this._color = color;
        this._opacity = opacity ?? 1;
    }

    protected materialFactory(): Material {
        return new MeshBasicMaterial({
            opacity: this._opacity,
            color: this._color,
            wireframe: true,
            depthWrite: false
        });
    }

    protected geometryFactory(): BufferGeometry {
        return new BoxGeometry(1.01, 1.01, 1.01);
    }
}
