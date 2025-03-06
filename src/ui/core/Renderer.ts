import { WebGLRenderer, Scene as ThreeScene, Clock } from 'three';
import { Scene } from './Scene';
import { Camera3D } from './Camera3D';

export class Renderer {
    private static _instance: Renderer;
    private _renderer: WebGLRenderer;
    private _camera: Camera3D;
    private _scenes: Scene[];
    private _threeScene: ThreeScene;
    private _clock: Clock;

    private constructor() {
        this._renderer = new WebGLRenderer({ antialias: true });
        this._clock = new Clock();
        this._threeScene = new ThreeScene();
        this._scenes = [];
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
            this._scenes.forEach(scene =>
                scene.loop(this._camera.threeCamera, this._clock.getDelta(), time)
            );

            this._renderer.render(this._threeScene, this._camera.threeCamera);
        });

        window.addEventListener('resize', () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.body.appendChild(this._renderer.domElement);
    }

    public addScene(...scenes: Scene[]) {
        scenes.forEach(scene => {
            scene.start(this._camera.threeCamera);
            this._scenes.push(scene);
            scene.objects.forEach(obj => {
                this._threeScene.add(obj.threeObject);
            });
        });
    }

    public set camera(camera: Camera3D) {
        this._camera = camera;
    }

    public instatiate() {
        if (!this._camera || this._scenes.length === 0) {
            throw new Error(
                'Unable to append partially initialized Renderer object. Make sure you are specifying Camera and at least one Scene object.'
            );
        }

        this.initializeRenderer();
        this._scenes.forEach(scene => scene.start(this._camera.threeCamera));
    }
}
