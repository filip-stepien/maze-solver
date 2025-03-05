import { WebGLRenderer, Camera as ThreeCamera, Scene as ThreeScene, Clock } from 'three';
import { Camera } from './Camera';
import { Scene } from './Scene';

export class Renderer {
    private static _instance: Renderer;
    private _renderer: WebGLRenderer;
    private _camera: Camera;
    private _scene: Scene;
    private _clock: Clock;

    private constructor() {
        this._renderer = new WebGLRenderer({ antialias: true });
        this._clock = new Clock();
    }

    public static get instance(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }

        return Renderer._instance;
    }

    private initializeRenderer() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this._renderer.setAnimationLoop(time => {
            this._scene.loop(this._camera.threeCamera, this._clock.getDelta(), time);
            this._renderer.render(this._scene.threeScene, this._camera.threeCamera);
        });

        window.addEventListener('resize', () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.body.appendChild(this._renderer.domElement);
    }

    public set scene(scene: Scene) {
        this._scene = scene;
    }

    public set camera(camera: Camera) {
        this._camera = camera;
    }

    public instatiate() {
        if (!this._camera || !this._scene) {
            throw new Error(
                'Unable to append partially initialized Renderer object. Make sure you are specifying Camera and Scene objects.'
            );
        }

        this.initializeRenderer();
        this._scene.start(this._camera.threeCamera);
    }
}
