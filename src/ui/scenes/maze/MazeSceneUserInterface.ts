import { BlankMazeStrategy } from '../../../strategies/generation/BlankMazeStrategy';
import { AStarStrategy } from '../../../strategies/MazePathFindStrategy/AStarStrategy';
import { Vec2d } from '../../../types';
import { Button } from '../../controls/Button';
import { NumberInput } from '../../controls/NumberInput';

export class MazeSceneUserInterface {
    private _mazeSize = new Vec2d([10, 10]);
    private _generationStrategy = new BlankMazeStrategy();
    private _pathFindStrategy = new AStarStrategy();
    private _sizeInputX = new NumberInput();
    private _sizeInputY = new NumberInput();
    private _resetButton = new Button('Reset');
    private _startButton = new Button('Start');

    private _onStart: () => void;
    private _onRestart: () => void;

    constructor() {
        this.handleSizeInputs();
        this.handleStartButton();
        this.handleResetButton();
    }

    private handleSizeInputs() {
        this._sizeInputX.value = 10;
        this._sizeInputX.min = 3;
        this._sizeInputX.max = 100;

        this._sizeInputY.value = 10;
        this._sizeInputY.min = 3;
        this._sizeInputY.max = 100;

        this._sizeInputX.onChange = value => {
            this._mazeSize.x = parseInt(value);
        };

        this._sizeInputY.onChange = value => {
            this._mazeSize.y = parseInt(value);
        };
    }

    private handleStartButton() {
        this._startButton.onChange = () => {
            this._onStart();
            this._startButton.disabled = true;
        };
    }

    private handleResetButton() {
        this._resetButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true)) {
                this._onRestart();
                this._startButton.disabled = false;
            }
        };
    }

    public get mazeSize() {
        return this._mazeSize;
    }

    public get generationStrategy() {
        return this._generationStrategy;
    }

    public get pathFindStrategy() {
        return this._pathFindStrategy;
    }

    public set onStart(handler: () => void) {
        this._onStart = handler;
    }

    public set onRestart(handler: () => void) {
        this._onRestart = handler;
    }
}
