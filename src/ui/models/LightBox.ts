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
    protected materialFactory(): Material {
        return new MeshBasicMaterial({ color: 0xffffff });
    }

    protected geometryFactory(): BufferGeometry {
        return new BoxGeometry(1.001, 1.001, 1.001);
    }
}
