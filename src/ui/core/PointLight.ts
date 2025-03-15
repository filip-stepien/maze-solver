import { PointLight as ThreePointLight } from 'three';
import { Light } from './Light';
import { Scene } from './Scene';

export class PointLight extends Light<ThreePointLight> {
    private _distance: number;

    constructor(scene: Scene, color: number, intensity: number, distance: number = 0) {
        super(scene, color, intensity);
        this._distance = distance;
    }

    protected get threeObjectFactory() {
        return new ThreePointLight(this.color, this.intensity, this._distance);
    }
}
