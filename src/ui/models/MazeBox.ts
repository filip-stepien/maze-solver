import { BoxGeometry, MeshNormalMaterial } from 'three';
import { Object3D } from '../core/Object3D';
import { Scene } from '../core/Scene';

export class MazeBox extends Object3D {
    constructor(scene: Scene) {
        const geometry = new BoxGeometry(0.2, 0.2, 0.2);
        const material = new MeshNormalMaterial();
        super(geometry, material, scene);
    }
}
