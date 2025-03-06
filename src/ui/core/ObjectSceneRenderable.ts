import { Object3D } from './Object3D';
import { Scene } from './Scene';

export class ObjectSceneRenderable extends Object3D {
    constructor(scene: Scene) {
        super();
        scene.addToScene(this);
    }
}
