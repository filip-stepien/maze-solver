import { BoxGeometry, MeshNormalMaterial, MeshStandardMaterial } from 'three';
import { Model3D } from '../core/Model3D';
import { Scene } from '../core/Scene';

export class MazeBox extends Model3D {
    constructor(scene: Scene) {
        super(new BoxGeometry(0.2, 0.2, 0.2), new MeshNormalMaterial(), scene);
    }
}
