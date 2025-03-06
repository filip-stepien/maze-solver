import { OrthographicCamera as ThreeOrthographicCamera } from 'three';
import { Camera3D } from './Camera3D';

export class OrthographicCamera extends Camera3D {
    private _size: number;
    private _left: number;
    private _right: number;

    constructor(size: number = 75, near?: number, far?: number) {
        super(near, far);
        this._size = size;
        this._left = this.calculateLeftFrustum();
        this._right = this.calculateRightFrustum();
    }

    private calculateLeftFrustum() {
        return -(this._aspectRatio * this._size);
    }

    private calculateRightFrustum() {
        return this._aspectRatio * this._size;
    }

    public override resize() {
        this._left = this.calculateLeftFrustum();
        this._right = this.calculateRightFrustum();
    }

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
