import { Mesh, BufferGeometry, Material } from 'three';
import { Scene } from './Scene';

export abstract class Object3D {
    protected _geometry: BufferGeometry;
    protected _material: Material;
    protected _mesh: Mesh;

    constructor(geometry: BufferGeometry, material: Material, scene: Scene) {
        this._geometry = geometry;
        this._material = material;
        this._mesh = new Mesh(this._geometry, this._material);
        scene.threeScene.add(this._mesh);
    }

    public get mesh() {
        return this._mesh;
    }
}
