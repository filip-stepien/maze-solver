import { PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { Camera3D } from './Camera3D';

/**
 * Camera with perspective projection.
 */
export class PerspectiveCamera extends Camera3D {
    /**
     * Vertical field of view.
     */
    private _fov: number;

    /**
     * @param fov Vertical field of view.
     * @param near Near clipping plane distance.
     * @param far Far clipping plane distance.
     */
    constructor(fov: number = 75, near?: number, far?: number) {
        super(near, far);
        this._fov = fov;
    }

    /**
     * Retrieve a `three.js` perspective camera.
     */
    public override get threeCameraFactory() {
        return new ThreePerspectiveCamera(this._fov, this._aspectRatio, this._near, this._far);
    }
}
