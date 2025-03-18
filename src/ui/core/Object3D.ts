import { Object3D as ThreeObject } from 'three';

/**
 * Wrapper class for `three.js` 3D objects.
 */
export abstract class Object3D<T extends ThreeObject = ThreeObject> {
    /**
     * Actual `three.js` object instance.
     */
    private _threeObject: T;

    /**
     * Factory method for creating a `three.js` object.
     * Subclasses should override this method to return correct `three.js` object.
     */
    protected abstract get threeObjectFactory(): T;

    afterThreeObject() {}

    /**
     * Retrieve a `three.js` object instance.
     * Object instance is created when this method is called for the first time.
     */
    public get threeObject(): T {
        if (!this._threeObject) {
            this._threeObject = this.threeObjectFactory;
            this.afterThreeObject();
        }
        return this._threeObject;
    }
}
