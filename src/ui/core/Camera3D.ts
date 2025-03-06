import { Camera as ThreeCamera } from 'three';

export abstract class Camera3D {
    protected _near: number;
    protected _far: number;
    protected _aspectRatio: number;
    protected _threeCamera: ThreeCamera;

    constructor(near: number = 0.1, far: number = 1000) {
        this._near = near;
        this._far = far;
        this._aspectRatio = window.innerWidth / window.innerHeight;

        window.addEventListener('resize', () => {
            this._aspectRatio = window.innerWidth / window.innerHeight;
            this._threeCamera = this.threeCameraFactory;
            this.resize();
        });
    }

    public get threeCamera(): ThreeCamera {
        if (!this._threeCamera) this._threeCamera = this.threeCameraFactory;
        return this._threeCamera;
    }

    public resize?(): void;
    public abstract get threeCameraFactory(): ThreeCamera;
}
