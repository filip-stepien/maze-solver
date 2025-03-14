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
    constructor(scene: Scene, material?: Material, geometry?: BufferGeometry) {
        super(scene);
        this._geometry = geometry;
        this._material = material;
    }

    public set geometry(geometry: BufferGeometry) {
        this._geometry = geometry;
    }

    public get geometry() {
        return this._geometry;
    }

    public set material(material: Material) {
        this._material = material;
    }

    public get material() {
        return this._material;
    }

    /**
     * Retrieve a `three.js` mesh.
     */
    override get threeObjectFactory() {
        return new Mesh(this._geometry, this._material);
    }
}
