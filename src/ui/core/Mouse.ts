import { Camera, Intersection, Object3D, Object3DEventMap, Raycaster, Scene, Vector2 } from 'three';

export class Mouse {
    private static _instance: Mouse;
    private _raycaster: Raycaster;
    private _pointer: Vector2;
    private _intersects: Intersection<Object3D<Object3DEventMap>>[];

    constructor() {
        this._raycaster = new Raycaster();
        this._pointer = new Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
        this._intersects = [];

        window.addEventListener('pointermove', this.pointerMove.bind(this));
    }

    public static get instance(): Mouse {
        if (!Mouse._instance) {
            Mouse._instance = new Mouse();
        }

        return Mouse._instance;
    }

    public get intersects() {
        return this._intersects;
    }

    private pointerMove(event: PointerEvent) {
        this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    public loop(scene: Scene, camera: Camera) {
        this._raycaster.setFromCamera(this._pointer, camera);
        this._intersects = this._raycaster.intersectObjects(scene.children);
    }
}
