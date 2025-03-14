import { Vector3 } from 'three';
import { Animation } from './Animation';
import { Scene } from './Scene';

export class BezierAnimation extends Animation {
    private _control1: Vector3;
    private _control2: Vector3;

    public setControl1(control: Vector3) {
        this._control1 = control.clone();
        return this;
    }

    public setControl2(control: Vector3) {
        this._control2 = control.clone();
        return this;
    }

    public animate(alpha: number): Vector3 {
        const t = alpha;
        const p0 = this.startVector;
        const p1 = this._control1;
        const p2 = this._control2;
        const p3 = this.endVector;

        return new Vector3(
            (1 - t) ** 3 * p0.x + 3 * (1 - t) ** 2 * t * p1.x + 3 * (1 - t) * t ** 2 * p2.x + t ** 3 * p3.x,
            (1 - t) ** 3 * p0.y + 3 * (1 - t) ** 2 * t * p1.y + 3 * (1 - t) * t ** 2 * p2.y + t ** 3 * p3.y,
            (1 - t) ** 3 * p0.z + 3 * (1 - t) ** 2 * t * p1.z + 3 * (1 - t) * t ** 2 * p2.z + t ** 3 * p3.z
        )
    }

    public override beforeAnimate(): void {
        this._control1 = this._control1 ?? this.startVector.clone().lerp(this.endVector, 1 / 3);
        this._control2 = this._control2 ?? this.startVector.clone().lerp(this.endVector, 2 / 3);
    }
}
