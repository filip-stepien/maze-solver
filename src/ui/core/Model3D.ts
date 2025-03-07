import { Mesh, BufferGeometry, Material } from 'three';
import { Scene } from './Scene';
import { Renderable } from './Renderable';

/**
 * Renderable mesh with geometry and material.
 */
export abstract class Model3D extends Renderable {
    /**
     * Geometry that defines the shape of the model.
     */
    private _geometry: BufferGeometry;

    /**
     * Material that defines the appearance of the model.
     */
    private _material: Material;

    /**
     * @param geometry Geometry that defines the shape of the model.
     * @param material Material that defines the appearance of the model.
     * @param scene Scene to which the model will be added.
     */
    constructor(geometry: BufferGeometry, material: Material, scene: Scene) {
        super(scene);
        this._geometry = geometry;
        this._material = material;
    }

    /**
     * Retrieve a `three.js` mesh.
     */
    override get threeObjectFactory() {
        return new Mesh(this._geometry, this._material);
    }
}
