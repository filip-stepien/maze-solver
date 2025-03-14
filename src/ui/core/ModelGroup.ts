import {
    BufferGeometry,
    InstancedMesh,
    Material,
    Matrix4,
    Vector3,
    Object3D as ThreeObject
} from 'three';
import { Model3D } from './Model3D';
import { Scene } from './Scene';

export class ModelGroup extends Model3D<InstancedMesh> {
    private _instanceCount: number;

    constructor(scene: Scene, count: number, material?: Material, geometry?: BufferGeometry) {
        super(scene, material, geometry);
        this._instanceCount = count;
    }

    public setInstancePosition(index: number, position: Vector3) {
        const matrix = new Matrix4();
        matrix.setPosition(position);
        this.threeObject.setMatrixAt(index, matrix);
        this.threeObject.instanceMatrix.needsUpdate = true;
    }

    public getInstancePosition(index: number) {
        const obj = new ThreeObject();
        this.threeObject.getMatrixAt(index, obj.matrix);
        obj.position.setFromMatrixPosition(obj.matrix);
        return obj.position;
    }

    public lerpInstancePosition(index: number, v1: Vector3, v2: Vector3, alpha: number) {
        const obj = new ThreeObject();

        this.threeObject.getMatrixAt(index, obj.matrix);
        obj.position.lerpVectors(v1, v2, alpha);
        obj.updateMatrix();

        this.threeObject.setMatrixAt(index, obj.matrix);
        this.threeObject.instanceMatrix.needsUpdate = true;
    }

    protected get threeObjectFactory() {
        return new InstancedMesh(this.geometry, this.material, this._instanceCount);
    }
}
