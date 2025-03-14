import { WebGLRenderer, Scene as ThreeScene, Clock } from 'three';
import { Scene } from './Scene';
import { Camera3D } from './Camera3D';
import Stats from 'three/examples/jsm/libs/stats.module';

/**
 * Abstraction layer for `three.js` WebGL renderer.
 * This class encapsulates the WebGL rendering logic, providing a simplified interface for rendering scenes.
 */
export class Renderer {
    /**
     * Renderer singleton instance.
     */
    private static _instance: Renderer;

    /**
     * Actual `three.js` renderer.
     */
    private _renderer: WebGLRenderer;

    /**
     * Camera that views the rendered scene.
     */
    private _camera: Camera3D;

    /**
     * Scenes to render.
     */
    private _scenes: Scene[];

    /**
     * The actual `three.js` canvas where objects are rendered.
     * All objects from the provided scenes will be displayed on this canvas.
     */
    private _threeScene: ThreeScene;

    /**
     * Clock for measuring time between frames.
     */
    private _clock: Clock;

    private _stats: Stats;

    private constructor() {
        this._clock = new Clock();
        this._threeScene = new ThreeScene();
        this._scenes = [];
        this._renderer = new WebGLRenderer({ antialias: true });
        this._stats = new Stats();

        document.body.appendChild(this._stats.dom);
        document.body.appendChild(this._renderer.domElement);
    }

    /**
     * Retrieve a singleton renderer instance.
     */
    public static get instance(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }

        return Renderer._instance;
    }

    /**
     * Sets size of renderer window, sets animations loop and appends canvas tag to the HTML.
     */
    private initializeRenderer() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this._renderer.setAnimationLoop(time => {
            this._stats.begin();

            this._scenes.forEach(scene => {
                const delta = this._clock.getDelta();
                scene.loop({ camera: this._camera, delta, time });
                scene.animate(delta);
                if (this._camera.lockAt) this._camera.threeObject.lookAt(this._camera.lockAt);
            });

            this._renderer.render(this._threeScene, this._camera.threeObject);

            this._stats.end();
        });

        window.addEventListener('resize', () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    /**
     * Adds scenes to be handled and rendered by the renderer.
     * @param scenes The scenes to be added to the renderer.
     */
    public addScene(...scenes: Scene[]) {
        scenes.forEach(scene => {
            this._scenes.push(scene);
            this._scenes.forEach(scene => scene.start({ camera: this._camera }));
            scene.objects.forEach(obj => {
                this._threeScene.add(obj.threeObject);
            });
        });
    }

    /**
     * Retrieve a camera that views the scene.
     */
    public set camera(camera: Camera3D) {
        this._camera = camera;
    }

    /**
     * Instantiates the renderer, which, due to the lack of a public constructor
     * in the singleton, must be done after initializing crucial properties.
     * Camera property and at least one Scene object must be specified,
     * in order to successfully instatiate the render.
     */
    public instatiate() {
        if (!this._camera) {
            throw new Error(
                'Unable to append partially initialized Renderer object. Make sure you are specifying Camera object.'
            );
        }

        this._camera.resize();
        this.initializeRenderer();
    }
}
