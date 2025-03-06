import { Camera, Mesh } from 'three';
import { Object3D } from './Object3D';

export abstract class Scene {
    protected _objects: Object3D[];

    constructor() {
        this._objects = [];
    }

    abstract start(camera: Camera): void;
    abstract loop(camera: Camera, delta: number, time: number): void;

    public getMeshes(): Mesh[] {
        return this._objects.map(obj => obj.mesh);
    }

    public addToScene(...objects: Object3D[]) {
        objects.forEach(obj => this._objects.push(obj));
    }
}
