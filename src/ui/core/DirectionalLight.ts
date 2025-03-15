import { DirectionalLight as ThreeDirLight } from 'three';
import { Light } from './Light';

export class DirectionalLight extends Light<ThreeDirLight> {
    protected get threeObjectFactory() {
        return new ThreeDirLight(this.color, this.intensity);
    }
}
