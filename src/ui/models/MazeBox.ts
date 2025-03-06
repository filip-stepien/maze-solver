import { BoxGeometry, MeshNormalMaterial } from 'three';
import { Model3D } from '../core/Model3D';
import { Scene } from '../core/Scene';

/**
 * Box that forms part of the path in a maze.
 */
export class MazeBox extends Model3D {
    constructor(scene: Scene) {
        super(new BoxGeometry(0.2, 0.2, 0.2), new MeshNormalMaterial(), scene);
    }
}
