import { BoxGeometry, MeshNormalMaterial } from 'three';
import { Model3D } from '../core/Model3D';
import { Scene } from '../core/Scene';

/**
 * Box that forms part of the path in a maze.
 */
export class MazeBox extends Model3D {
    constructor(scene: Scene) {
        super(scene);
        this.geometry = new BoxGeometry(MazeBox.size, MazeBox.size, MazeBox.size);
        this.material = new MeshNormalMaterial();
    }

    public static get size() {
        return 0.5;
    }
}
