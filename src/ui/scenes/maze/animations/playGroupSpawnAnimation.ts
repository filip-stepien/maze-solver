import { Vector3 } from 'three';
import { LinearAnimation } from '../../../core/LinearAnimation';
import { Scene } from '../../../core/Scene';
import { ModelGroup } from '../../../core/ModelGroup';

export default function (
    scene: Scene,
    group: ModelGroup,
    index: number,
    doneCallback: () => void = () => {}
) {
    new LinearAnimation(scene)
        .setStartVector(new Vector3(1, 1, 1))
        .setEndVector(new Vector3(1.15, 1.15, 1.15))
        .setDuration(0.02)
        .setCallback(vec => group.setInstanceScale(index, vec))
        .setDoneCallback(() => {
            new LinearAnimation(scene)
                .setStartVector(new Vector3(1.15, 1.15, 1.15))
                .setEndVector(new Vector3(1, 1, 1))
                .setDuration(0.02)
                .setCallback(vec => group.setInstanceScale(index, vec))
                .setDoneCallback(doneCallback)
                .start();
        })
        .start();
}
