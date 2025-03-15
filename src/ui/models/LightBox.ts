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
    constructor(scene: Scene) {
        super(scene);
        this.geometry = new BoxGeometry(1, 1, 1);
        this.material = new MeshBasicMaterial({ color: 0xffffff });
    }
}
