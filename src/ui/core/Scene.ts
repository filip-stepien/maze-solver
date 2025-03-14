import { Vector3 } from 'three';
import { Camera3D } from './Camera3D';
import { Object3D } from './Object3D';
import { Renderer } from './Renderer';
import { ModelGroup } from './ModelGroup';

export type StartArgs = {
    camera: Camera3D;
    renderer: Renderer;
};

export type LoopArgs = {
    camera: Camera3D;
    renderer: Renderer;
    delta: number;
    time: number;
};

export type Animation = {
    callback: (vec: Vector3) => void;
    current: Vector3;
    start: Vector3;
    end: Vector3;
    duration: number;
    elapsedTime: number;
};

/**
 * Scene, which manages rendered objects.
 */
export class Scene {
    /** Objects rendered on this scene. */
    private _objects: Object3D[];

    /** Active animations. */
    private _animations: Animation[] = [];

    constructor() {
        this._objects = [];
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

    public animate({ delta }: LoopArgs): void {
        this._animations = this._animations.filter(anim => {
            anim.elapsedTime += delta;

            const t = Math.min(anim.elapsedTime / anim.duration, 1);
            const v1 = anim.start;
            const v2 = anim.end;
            const vec = anim.current.lerpVectors(v1, v2, t);

            anim.callback(vec);
            anim.current = vec;

            return t < 1;
        });
    }

    /** Adds new objects to the scene. */
    public addToScene(...objects: Object3D[]) {
        objects.forEach(obj => this._objects.push(obj));
    }

    /** Animates an object's position over a duration. */
    public linearAnimation(
        start: Vector3,
        end: Vector3,
        duration: number,
        callback: (vec: Vector3) => void
    ) {
        this._animations.push({
            callback,
            current: start.clone(),
            start: start.clone(),
            end: end.clone(),
            duration,
            elapsedTime: 0
        });
    }
}
