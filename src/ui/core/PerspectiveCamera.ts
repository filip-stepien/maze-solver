import { PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import { Camera3D } from './Camera3D';

export class PerspectiveCamera extends Camera3D {
    private _fov: number;

    constructor(fov: number = 75, near?: number, far?: number) {
        super(near, far);
        this._fov = fov;
    }

    public override get threeCameraFactory() {
        return new ThreePerspectiveCamera(this._fov, this._aspectRatio, this._near, this._far);
    }
}
