import { PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { Camera } from './Camera';

export class PerspectiveCamera implements Camera {
    private _fov: number;
    private _near: number;
    private _far: number;
    private _aspectRatio: number;
    private _camera: ThreePerspectiveCamera;

    constructor(fov?: number, near?: number, far?: number) {
        this._fov = fov || 75;
        this._near = near || 0.1;
        this._far = far || 1000;
        this._aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new ThreePerspectiveCamera(
            this._fov,
            this._aspectRatio,
            this._near,
            this._far
        );

        window.addEventListener('resize', () => {
            this._aspectRatio = window.innerWidth / window.innerHeight;
            this._camera.aspect = this._aspectRatio;
            this._camera.updateProjectionMatrix();
        });
    }

    public get threeCamera() {
        return this._camera;
    }
}
