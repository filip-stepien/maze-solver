import { Camera } from 'three';
import { Object3D } from './Object3D';

/**
 * Scene, which manages rendered objects.
 */
export abstract class Scene {
    /**
     * Objects rendered on this scene.
     */
    protected _objects: Object3D[];

    constructor() {
        this._objects = [];
    }

    /**
     * Method called once, before adding the scene to the actual three.js renderer.
     * Subclasses should override this method to implement
     * initialization or logic that needs to be executed only once.
     * @param camera Object that be used to manipulate the camera that views the scene.
     */
    abstract start(camera: Camera): void;

    /**
     * Method for the main loop, called every frame.
     * Subclasses should override this method to implement frame-specific logic.
     * @param camera Object that be used to manipulate the camera that views the scene.
     * @param delta Time difference between the current and previous frame (in seconds).
     * @param time Elapsed time since the start of the loop (in milliseconds).
     */
    abstract loop(camera: Camera, delta: number, time: number): void;

    /**
     * Retrieve all objects that belong to this scene.
     */
    public get objects(): Object3D[] {
        return this._objects;
    }

    /**
     * Adds new object to this scene.
     */
    public addToScene(...objects: Object3D[]) {
        objects.forEach(obj => this._objects.push(obj));
    }
}
