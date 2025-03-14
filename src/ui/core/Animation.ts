import { Vector3 } from 'three';
import { Scene } from './Scene';

export abstract class Animation {
    private _scene: Scene;
    private _currentVector: Vector3;
    private _endVector: Vector3;
    private _startVector: Vector3;
    private _durationSeconds: number;
    private _elapsedTime: number;
    private _callback: (vec: Vector3) => void;

    constructor(scene: Scene) {
        this._scene = scene;
        this._elapsedTime = 0;
        this._durationSeconds = 1;
        this._callback = () => {};
    }

    public get startVector() {
        return this._startVector;
    }

    public get endVector() {
        return this._endVector;
    }

    public get durationSeconds() {
        return this._durationSeconds;
    }

    public get elapsedTime() {
        return this._elapsedTime;
    }

    public get callback() {
        return this._callback;
    }

    public get currentVector() {
        return this._currentVector;
    }

    public set currentVector(currentVector: Vector3) {
        this._currentVector = currentVector;
    }

    public set elapsedTime(value: number) {
        this._elapsedTime = value;
    }

    public setStartVector(startVector: Vector3) {
        this._startVector = startVector.clone();
        this._currentVector = startVector.clone();
        return this;
    }

    public setEndVector(endVector: Vector3) {
        this._endVector = endVector;
        return this;
    }

    public setDuration(durationSeconds: number) {
        this._durationSeconds = durationSeconds;
        return this;
    }

    public setCallback(callback: (vec: Vector3) => void) {
        this._callback = callback;
        return this;
    }

    public start() {
        if (!this._startVector || !this._endVector) {
            console.trace('Animation has no start or end vector set!');
            return;
        }

        this.beforeAnimate();
        this._scene.addAnimation(this);
    }

    public beforeAnimate(): void {}

    public abstract animate(alpha: number): Vector3;
}
