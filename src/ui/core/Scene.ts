import { Camera, Object3D as ThreeObject } from 'three';
import { Object3D } from './Object3D';

export abstract class Scene {
    protected _objects: Object3D[];

    constructor() {
        this._objects = [];
    }

    abstract start(camera: Camera): void;
    abstract loop(camera: Camera, delta: number, time: number): void;

    public get objects(): Object3D[] {
        return this._objects;
    }

    public addToScene(...objects: Object3D[]) {
        objects.forEach(obj => this._objects.push(obj));
    }
}
