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

export abstract class ModelGroup extends Model3D<InstancedMesh> {
    private _instanceCount: number;

    constructor(scene: Scene, count: number) {
        super(scene);
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

    protected get threeObjectFactory() {
        return new InstancedMesh(this.geometry, this.material, this._instanceCount);
    }
}
