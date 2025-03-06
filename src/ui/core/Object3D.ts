import { Mesh, BufferGeometry, Material } from 'three';
import { Scene } from './Scene';

export abstract class Object3D {
    protected _mesh: Mesh;

    constructor(geometry: BufferGeometry, material: Material, scene: Scene) {
        this._mesh = new Mesh(geometry, material);
        scene.addToScene(this);
    }

    public get mesh() {
        return this._mesh;
    }
}
