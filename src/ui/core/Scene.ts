import { Vector3 } from 'three';
import { Camera3D } from './Camera3D';
import { Object3D } from './Object3D';
import { Renderer } from './Renderer';
import { Animation } from './Animation';

export type StartArgs = {
    camera: Camera3D;
};

export type LoopArgs = {
    camera: Camera3D;
    delta: number;
    time: number;
};
/**
 * Scene, which manages rendered objects.
 */
export class Scene {
    /** Objects rendered on this scene. */
    private _objects: Object3D[];

    /** Active animations. */
    private _animations: Animation[];

    constructor() {
        this._objects = [];
        this._animations = [];
    }

    /** Retrieve all objects in the scene. */
    public get objects(): Object3D[] {
        return this._objects;
    }

    /** Method called once before adding the scene to the renderer. */
    public start(args: StartArgs): void {}

    /**
     * Main loop method, called every frame.
     * Updates animations.
     */
    public loop(args: LoopArgs): void {}

    public animate(delta: number): void {
        this._animations = this._animations.filter(animation => {
            animation.elapsedTime += delta;

            const alpha = Math.min(animation.elapsedTime / animation.durationSeconds, 1);
            const vec = animation.animate(alpha);

            animation.callback(vec);
            animation.currentVector = vec;

            return alpha < 1;
        });
    }

    /** Adds new objects to the scene. */
    public addToScene(...objects: Object3D[]) {
        this._objects.push(...objects);
    }

    public addAnimation(...animatons: Animation[]) {
        this._animations.push(...animatons);
    }
}
