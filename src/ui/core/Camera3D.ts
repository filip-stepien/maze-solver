import { Camera as ThreeCamera } from 'three';

/**
 * Wrapper for `three.js` camera.
 */
export abstract class Camera3D {
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

    /**
     * @param near Near clipping plane distance.
     * @param far Far clipping plane distance.
     */
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

    /**
     * Retrieve a `three.js` camera instance.
     * Camera instance is created when this method is called for the first time.
     */
    public get threeCamera(): ThreeCamera {
        if (!this._threeCamera) this._threeCamera = this.threeCameraFactory;
        return this._threeCamera;
    }

    /**
     * Handles camera resize events.
     * Note: aspect ratio changes are handled by default.
     */
    public resize?(): void;

    /**
     * Factory method for creating a `three.js` camera.
     * Subclasses should override this method to return a correct `three.js` camera object.
     */
    public abstract get threeCameraFactory(): ThreeCamera;
}
