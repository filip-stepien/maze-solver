import { Object3D } from './Object3D';
import { Scene } from './Scene';
import { Object3D as ThreeObject } from 'three';

/**
 * Object that can be rendered in a scene.
 */
export abstract class Renderable<T extends ThreeObject> extends Object3D<T> {
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
