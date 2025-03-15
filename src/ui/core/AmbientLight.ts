import { AmbientLight as ThreeAmbientLight } from 'three';
import { Light } from './Light';

export class AmbientLight extends Light<ThreeAmbientLight> {
    protected get threeObjectFactory() {
        return new ThreeAmbientLight(this.color, this.intensity);
    }
}
