import { Object3D as ThreeObject } from 'three';

/**
 * Wrapper class for `three.js` 3D objects.
 */
export class Object3D {
    /**
     * Actual `three.js` object instance.
     */
    private _threeObject: ThreeObject;

    /**
     * Retrieve a `three.js` object instance.
     * Object instance is created when this method is called for the first time.
     */
    public get threeObject(): ThreeObject {
        if (!this._threeObject) this._threeObject = this.threeObjectFactory;
        return this._threeObject;
    }

    /**
     * Factory method for creating a `three.js` object.
     * Subclasses should override this method to return correct `three.js` object.
     */
    protected get threeObjectFactory(): ThreeObject {
        return new ThreeObject();
    }
}
