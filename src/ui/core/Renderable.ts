import { Object3D } from './Object3D';
import { Scene } from './Scene';
import { Object3D as ThreeObject } from 'three';
import { Renderer } from './Renderer';

/**
 * Object that can be rendered in a scene.
 */
export abstract class Renderable<T extends ThreeObject = ThreeObject> extends Object3D<T> {
    private _scene: Scene;

    /**
     * Calling a constructor (e.g. instantiating class)
     * automatically adds the instance to the specified scene.
     * @param scene The scene to which this instance will be added.
     */
    constructor(scene: Scene) {
        super();
        this._scene = scene;
    }

    override afterThreeObject(): void {
        this._scene.addToScene(this);
    }

    abstract delete(): void;
}
