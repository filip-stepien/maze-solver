import { Camera as ThreeCamera } from 'three';

export interface Camera {
    get threeCamera(): ThreeCamera;
}
