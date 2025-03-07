import { Object3D } from './Object3D';
import { Scene } from './Scene';

/**
 * Object that can be rendered in a scene.
 */
export class Renderable extends Object3D {
    /**
     * Calling a constructor (e.g. instantiating class)
     * automatically adds the instance to the specified scene.
     * @param scene The scene to which this instance will be added.
     */
    constructor(scene: Scene) {
        super();
        scene.addToScene(this);
    }
}
