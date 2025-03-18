import { WebGLRenderer, Scene as ThreeScene, Clock, Object3D as ThreeObject } from 'three';
import { Scene } from './Scene';
import { Camera3D } from './Camera3D';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Renderable } from './Renderable';

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
     * Camera that views the rendered scene.
     */
    private _camera: Camera3D;

    /**
     * Scenes to render.
     */
    private _scene: Scene;

    /**
     * Actual `three.js` renderer.
     */
    private _renderer = new WebGLRenderer({ antialias: true });

    /**
     * The actual `three.js` canvas where objects are rendered.
     * All objects from the provided scenes will be displayed on this canvas.
     */
    private _threeScene = new ThreeScene();

    /**
     * Clock for measuring time between frames.
     */
    private _clock = new Clock();

    private _stats = new Stats();

    private _debugMode = false;

    private constructor() {
        this.appendElements();
        this.setResizeListener();
    }

    private appendElements() {
        document.body.appendChild(this._renderer.domElement);
        document.body.appendChild(this._stats.dom);
        this.setDebugMeterDisplay();
    }

    private setResizeListener() {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    private animationLoop(time: number) {
        const delta = this._clock.getDelta();
        this._scene.loop({ camera: this._camera, renderer: this, delta, time });
        this._scene.animate(delta);
        this._camera.loop();
        this._renderer.render(this._threeScene, this._camera.threeObject);
    }

    private setDebugMeterDisplay() {
        this._stats.dom.style.top = '50%';
        this._stats.dom.style.display = this._debugMode ? 'block' : 'none';
    }

    public set camera(camera: Camera3D) {
        this._camera = camera;
    }

    public get camera() {
        return this._camera;
    }

    public set scene(scene: Scene) {
        this._scene = scene;
    }

    public get scene() {
        return this.scene;
    }

    public set debugMode(debugMode: boolean) {
        this._debugMode = debugMode;
        this.setDebugMeterDisplay();
    }

    public static get instance(): Renderer {
        if (!Renderer._instance) {
            Renderer._instance = new Renderer();
        }

        return Renderer._instance;
    }

    public addToThreeScene(...obj: ThreeObject[]) {
        this._threeScene.add(...obj);
    }

    public clear() {
        this._renderer.renderLists.dispose();
        this._threeScene.clear();
    }

    public start() {
        if (!this._camera || !this._scene) {
            throw new Error(
                'Unable to append partially initialized Renderer object. Make sure you are specifying Camera and Scene object.'
            );
        }

        this._scene.start({ camera: this._camera, renderer: this });
        this._renderer.setAnimationLoop(time => {
            this._stats.begin();
            this.animationLoop(time);
            this._stats.end();
        });
    }
}
