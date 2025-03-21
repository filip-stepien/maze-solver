import { Camera, Intersection, Object3D, Object3DEventMap, Raycaster, Scene, Vector2 } from 'three';

export type MouseIntersection = Intersection<Object3D<Object3DEventMap>>;
export type MouseButton = 'left' | 'right' | 'middle';

export type MouseKeyCodeMap = {
    [keyCode: number]: MouseButton;
};

export type MouseOnClickHandler = (args: {
    button: MouseButton;
    intersects: MouseIntersection[];
}) => void;

export class Mouse {
    private static _instance: Mouse;
    private _raycaster = new Raycaster();
    private _pointer = new Vector2(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    private _intersects: MouseIntersection[] = [];
    private _buttonDown: MouseButton | null = null;
    private _mouseKeyCodeMap: MouseKeyCodeMap = {
        0: 'left',
        1: 'middle',
        2: 'right'
    };

    constructor() {
        window.addEventListener('pointermove', this.handlePointerMove.bind(this));
        window.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        window.addEventListener('pointerup', this.handlePointerUp.bind(this));
        window.addEventListener('contextmenu', e => e.preventDefault());
    }

    public static get instance(): Mouse {
        if (!Mouse._instance) {
            Mouse._instance = new Mouse();
        }

        return Mouse._instance;
    }

    public get intersects(): MouseIntersection[] {
        return this._intersects;
    }

    public get buttonDown(): MouseButton | null {
        return this._buttonDown;
    }

    public set onClick(handler: MouseOnClickHandler) {
        window.addEventListener('click', (event: PointerEvent) =>
            handler({ button: this._mouseKeyCodeMap[event.button], intersects: this._intersects })
        );
    }

    private handlePointerMove(event: PointerEvent) {
        this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    private handlePointerUp() {
        this._buttonDown = null;
    }

    private handlePointerDown(event: PointerEvent) {
        this._buttonDown = this._mouseKeyCodeMap[event.button];
    }

    public loop(scene: Scene, camera: Camera) {
        this._raycaster.setFromCamera(this._pointer, camera);
        this._intersects = this._raycaster.intersectObjects(scene.children);
    }
}
