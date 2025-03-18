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
    const startVec = group.getInstancePosition(index);
    const endVec = new Vector3(startVec.x, -150, startVec.y);
    new LinearAnimation(scene)
        .setStartVector(startVec)
        .setEndVector(endVec)
        .setDuration(2)
        .setCallback(vec => group.setInstancePosition(index, vec))
        .setDoneCallback(doneCallback)
        .start();
}
