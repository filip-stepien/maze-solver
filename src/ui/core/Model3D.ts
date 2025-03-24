import { Mesh, BufferGeometry, Material } from 'three';
import { Scene } from './Scene';
import { Renderable } from './Renderable';
import { Object3D as ThreeObject } from 'three';
import { Renderer } from './Renderer';

/**
 * Renderable mesh with geometry and material.
 */
export abstract class Model3D<T extends Mesh = Mesh> extends Renderable<T> {
    /**
     * Geometry that defines the shape of the model.
     */
    private _geometry: BufferGeometry;

    /**
     * Material that defines the appearance of the model.
     */
    private _material: Material;

    constructor(scene: Scene) {
        super(scene);
    }

    protected get geometry() {
        if (!this._geometry) this._geometry = this.geometryFactory();
        return this._geometry;
    }

    protected get material() {
        if (!this._material) this._material = this.materialFactory();
        return this._material;
    }

    public delete() {
        this._material.dispose();
        this._geometry.dispose();
    }

    /**
     * Retrieve a `three.js` mesh.
     */
    protected get threeObjectFactory() {
        return new Mesh(this.geometry, this.material) as T;
    }

    protected abstract materialFactory(): Material;
    protected abstract geometryFactory(): BufferGeometry;
}
