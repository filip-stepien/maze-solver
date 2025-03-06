import { Object3D as ThreeObject } from 'three';

export class Object3D {
    public _threeObject: ThreeObject;

    public get threeObject(): ThreeObject {
        if (!this._threeObject) this._threeObject = this.threeObjectFactory;
        return this._threeObject;
    }

    protected get threeObjectFactory(): ThreeObject {
        return new ThreeObject();
    }
}
