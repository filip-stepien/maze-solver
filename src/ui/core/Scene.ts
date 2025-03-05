import { Scene as ThreeScene, Camera } from 'three';

export abstract class Scene {
    protected _scene: ThreeScene;

    constructor() {
        this._scene = new ThreeScene();
    }

    abstract start(camera: Camera): void;
    abstract loop(camera: Camera, delta: number, time: number): void;

    public get threeScene() {
        return this._scene;
    }
}
