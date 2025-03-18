import { Vector3 } from 'three';
import { LinearAnimation } from '../../../core/LinearAnimation';
import { Scene } from '../../../core/Scene';
import { Light } from '../../../core/Light';

export default function (scene: Scene, light: Light, doneCallback: () => void = () => {}) {
    new LinearAnimation(scene)
        .setStartVector(new Vector3(0))
        .setEndVector(new Vector3(30))
        .setDuration(0.2)
        .setCallback(vec => (light.threeObject.intensity = vec.x))
        .setDoneCallback(() => {
            new LinearAnimation(scene)
                .setStartVector(new Vector3(30))
                .setEndVector(new Vector3(10))
                .setDuration(0.2)
                .setCallback(vec => (light.threeObject.intensity = vec.x))
                .setDoneCallback(doneCallback)
                .start();
        })
        .start();
}
