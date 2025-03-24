import { Renderable } from './Renderable';
import { Light as ThreeLight } from 'three';
import { Scene } from './Scene';
import { Renderer } from './Renderer';

export abstract class Light<T extends ThreeLight = ThreeLight> extends Renderable<T> {
    private _color: number;
    private _intensity: number;

    constructor(scene: Scene, color: number, intensity: number) {
        super(scene);
        this._color = color;
        this._intensity = intensity;
    }

    public get color() {
        return this._color;
    }

    public get intensity() {
        return this._intensity;
    }

    delete(): void {
        this.threeObject.dispose();
        Renderer.instance.removeFromThreeScene(this.threeObject);
    }
}
