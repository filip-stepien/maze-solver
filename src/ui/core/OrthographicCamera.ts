import { OrthographicCamera as ThreeOrthographicCamera } from 'three';
import { Camera3D } from './Camera3D';

/**
 * Camera with orthographic projection.
 */
export class OrthographicCamera extends Camera3D {
    /**
     * Camera frustum size.
     */
    private _size: number;

    /**
     * Left edge of camera frustum.
     */
    private _left: number;

    /**
     * Right edge of camera frustum.
     */
    private _right: number;

    /**
     * @param size Camera frustum size.
     * @param near Near clipping plane distance.
     * @param far Far clipping plane distance.
     */
    constructor(size: number = 75, near?: number, far?: number) {
        super(near, far);
        this._size = size;
        this._left = this.calculateLeftFrustum();
        this._right = this.calculateRightFrustum();
    }

    /**
     * Calculates position of the left edge of the camera frustum.
     */
    private calculateLeftFrustum() {
        return -(this._aspectRatio * this._size);
    }

    /**
     * Calculates position of the right edge of the camera frustum.
     */
    private calculateRightFrustum() {
        return this._aspectRatio * this._size;
    }

    /**
     * Resize event callback.
     */
    public override resize() {
        this._left = this.calculateLeftFrustum();
        this._right = this.calculateRightFrustum();
    }

    /**
     * Retrieve a `three.js` orthographic camera.
     */
    public override get threeCameraFactory() {
        return new ThreeOrthographicCamera(
            this._left,
            this._right,
            this._size,
            -this._size,
            this._near,
            this._far
        );
    }
}
