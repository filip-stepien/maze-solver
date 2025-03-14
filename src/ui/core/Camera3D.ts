import { Camera, Camera as ThreeCamera, Vector3 } from 'three';
import { Object3D } from './Object3D';

/**
 * Wrapper for `three.js` camera.
 */
export abstract class Camera3D<T extends ThreeCamera = ThreeCamera> extends Object3D<T> {
    /**
     * Near clipping plane distance.
     */
    protected _near: number;

    /**
     * Far clipping plane distance.
     */
    protected _far: number;

    /**
     * Ratio of witdh to height.
     */
    protected _aspectRatio: number;

    /**
     * Actual `three.js` camera instance.
     */
    protected _threeCamera: ThreeCamera;

    protected _lockAt: Vector3;

    /**
     * @param near Near clipping plane distance.
     * @param far Far clipping plane distance.
     */
    constructor(near: number = 0.1, far: number = 1000) {
        super();

        this._near = near;
        this._far = far;
        this._aspectRatio = window.innerWidth / window.innerHeight;

        window.addEventListener('resize', () => {
            this._aspectRatio = window.innerWidth / window.innerHeight;
            this.resize();
        });
    }

    public set lockAt(pos: Vector3) {
        this._lockAt = pos;
    }

    public get lockAt() {
        return this._lockAt;
    }

    /**
     * Handles camera resize events.
     * Note: aspect ratio changes are handled by default.
     */
    public resize?(): void;
}
