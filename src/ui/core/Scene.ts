import { Vector3 } from 'three';
import { Camera3D } from './Camera3D';
import { Object3D } from './Object3D';
import { Renderer } from './Renderer';

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
    object: Object3D | Camera3D;
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
    protected _objects: Object3D[];

    /** Active animations. */
    private _animations: Animation[] = [];

    constructor() {
        this._objects = [];
    }

    private isCamera(object: Object3D | Camera3D): object is Camera3D {
        return (object as Camera3D).threeCamera !== undefined;
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

            if (this.isCamera(anim.object)) {
                anim.object.threeCamera.position.lerpVectors(anim.start, anim.end, t);
            } else {
                anim.object.threeObject.position.lerpVectors(anim.start, anim.end, t);
            }

            return t < 1;
        });
    }

    /** Adds new objects to the scene. */
    public addToScene(...objects: Object3D[]) {
        objects.forEach(obj => this._objects.push(obj));
    }

    /** Animates an object's position over a duration. */
    public animatePosition(object: Object3D | Camera3D, endPos: Vector3, duration: number) {
        const position = this.isCamera(object)
            ? object.threeCamera.position
            : object.threeObject.position;

        this._animations.push({
            object,
            start: position.clone(),
            end: endPos.clone(),
            duration,
            elapsedTime: 0
        });
    }
}
