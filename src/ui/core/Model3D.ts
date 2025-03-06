import { Mesh, BufferGeometry, Material } from 'three';
import { Scene } from './Scene';
import { ObjectSceneRenderable } from './ObjectSceneRenderable';

export abstract class Model3D extends ObjectSceneRenderable {
    private _geometry: BufferGeometry;
    private _material: Material;

    constructor(geometry: BufferGeometry, material: Material, scene: Scene) {
        super(scene);
        this._geometry = geometry;
        this._material = material;
    }

    override get threeObjectFactory() {
        return new Mesh(this._geometry, this._material);
    }
}
