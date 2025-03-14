import { Vector3 } from 'three';
import { Animation } from './Animation';

export class LinearAnimation extends Animation {
    public animate(alpha: number): Vector3 {
        return this.currentVector.lerpVectors(this.startVector, this.endVector, alpha);
    }
}
