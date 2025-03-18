import { Vector3 } from 'three';
import { LinearAnimation } from '../../../core/LinearAnimation';
import { Scene } from '../../../core/Scene';
import { Model3D } from '../../../core/Model3D';

export default function (scene: Scene, box: Model3D, doneCallback: () => void = () => {}) {
    new LinearAnimation(scene)
        .setStartVector(new Vector3(1, 1, 1))
        .setEndVector(new Vector3(1.15, 1.15, 1.15))
        .setDuration(0.01)
        .setCallback(({ x, y, z }) => box.threeObject.scale.set(x, y, z))
        .setDoneCallback(() => {
            new LinearAnimation(scene)
                .setStartVector(new Vector3(1.15, 1.15, 1.15))
                .setEndVector(new Vector3(1, 1, 1))
                .setDuration(0.01)
                .setCallback(({ x, y, z }) => box.threeObject.scale.set(x, y, z))
                .setDoneCallback(doneCallback)
                .start();
        })
        .start();
}
