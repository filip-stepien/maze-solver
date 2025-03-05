import { OrthographicCamera as ThreeOrthographicCamera } from 'three';
import { Camera } from './Camera';

export class OrthographicCamera implements Camera {
    private _size: number;
    private _near: number;
    private _far: number;
    private _aspectRatio: number;
    private _camera: ThreeOrthographicCamera;

    constructor(size?: number, near?: number, far?: number) {
        this._size = size || 75;
        this._near = near || 0.1;
        this._far = far || 1000;
        this._aspectRatio = window.innerWidth / window.innerHeight;
        this._camera = new ThreeOrthographicCamera(
            -(this._aspectRatio * this._size),
            this._aspectRatio * this._size,
            this._size,
            -this._size,
            this._near,
            this._far
        );

        window.addEventListener('resize', () => {
            this._aspectRatio = window.innerWidth / window.innerHeight;
            this._camera.right = this._aspectRatio * this._size;
            this._camera.left = -(this._aspectRatio * this._size);
            this._camera.updateProjectionMatrix();
        });
    }

    public get threeCamera() {
        return this._camera;
    }
}
