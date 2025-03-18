import { Vector3 } from 'three';
import { LinearAnimation } from '../../../core/LinearAnimation';
import { Scene } from '../../../core/Scene';
import { PointLight } from '../../../core/PointLight';
import playBoxSpawnAnimation from '../animations/playBoxSpawnAnimation';
import playLightSpawnAnimation from '../animations/playLightSpawnAnimation';
import { EmissiveBox } from './EmissiveBoxGroup';

export class GlowingBox {
    private _box: EmissiveBox;
    private _pointLights: PointLight[];

    constructor(scene: Scene, pos: Vector3, color: number = 0xffffff) {
        this._box = new EmissiveBox(scene, color);
        this._pointLights = [new PointLight(scene, color, 0), new PointLight(scene, color, 0)];
        this.position = pos;

        playBoxSpawnAnimation(scene, this._box);
        playLightSpawnAnimation(scene, this._pointLights[0]);
        playLightSpawnAnimation(scene, this._pointLights[1]);
    }

    public set position(pos: Vector3) {
        const { x, y, z } = pos;
        this._box.threeObject.position.set(x, y, z);
        this._pointLights[0].threeObject.position.set(x, y, z);
        this._pointLights[1].threeObject.position.set(x, y + 1, z);
    }

    public delete() {
        this._box.delete();
        this._pointLights.forEach(light => light.delete());
    }
}
