import { MazePathFinderNode } from '../../../maze/MazePathFinderNode';
import { BlankMazeStrategy } from '../../../strategies/generation/BlankMazeStrategy';
import { GenerationStrategy } from '../../../strategies/generation/GenerationStrategy';
import { PrimsStrategy } from '../../../strategies/generation/PrimsStrategy';
import { AStarStrategy } from '../../../strategies/MazePathFindStrategy/AStarStrategy';
import { BFSStrategy } from '../../../strategies/MazePathFindStrategy/BFSStrategy';
import { DFSStrategy } from '../../../strategies/MazePathFindStrategy/DFSStrategy';
import { MazePathFindStrategy } from '../../../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { Vec2d } from '../../../types';
import { Button } from '../../controls/Button';
import { DropDown } from '../../controls/DropDown';
import { NumberInput } from '../../controls/NumberInput';

type GenerationStrategyMap = {
    [label: string]: GenerationStrategy;
};

type PathFindStrategyMap = {
    [label: string]: MazePathFindStrategy<MazePathFinderNode>;
};

export class MazeSceneUserInterface {
    // drop down options
    // <label>: <strategy object>
    private _GENERATION_STRATEGIES: GenerationStrategyMap = {
        'Manual': new BlankMazeStrategy(),
        "Prim's Algorithm": new PrimsStrategy()
    };

    private _PATH_FIND_STRATEGIES: PathFindStrategyMap = {
        'A*': new AStarStrategy(),
        'DFS': new DFSStrategy(),
        'BFS': new BFSStrategy()
    };

    // maze params
    private _mazeSize = new Vec2d([10, 10]);
    private _generationStrategy = new BlankMazeStrategy();
    private _pathFindStrategy = new AStarStrategy();

    // ui controls
    private _sizeInputX = new NumberInput();
    private _sizeInputY = new NumberInput();
    private _resetButton = new Button('Reset');
    private _startButton = new Button('Start');
    private _generationStrategyDropDown = new DropDown();
    private _pathFindStrategyDropDown = new DropDown();

    // control handlers
    private _onStart: () => void = function () {};
    private _onRestart: () => void = function () {};
    private _onGenerationChange: (label: string) => void = function () {};
    private _onPathFindChange: (label: string) => void = function () {};

    constructor() {
        this.initSizeInputs();
        this.initStartButton();
        this.initResetButton();
        this.initDropDowns();
    }

    private initSizeInputs() {
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

    private initStartButton() {
        this._startButton.onChange = () => {
            this._onStart();
        };
    }

    private initResetButton() {
        this._resetButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true)) {
                this._onRestart();
            }
        };
    }

    private initDropDowns() {
        Object.keys(this._GENERATION_STRATEGIES).forEach(label =>
            this._generationStrategyDropDown.addOption(label)
        );

        Object.keys(this._PATH_FIND_STRATEGIES).forEach(label =>
            this._pathFindStrategyDropDown.addOption(label)
        );

        this._generationStrategyDropDown.onChange = label => {
            this._generationStrategy = this._GENERATION_STRATEGIES[label];
            this._onGenerationChange(label);
        };

        this._pathFindStrategyDropDown.onChange = label => {
            this._pathFindStrategy = this._PATH_FIND_STRATEGIES[label];
            this._onPathFindChange(label);
        };
    }

    public get initialGenerationStrategyName() {
        return Object.keys(this._GENERATION_STRATEGIES)?.at(0);
    }

    public get initialPathFindStrategyName() {
        return Object.keys(this._PATH_FIND_STRATEGIES)?.at(0);
    }

    public get maze() {
        return {
            size: this._mazeSize,
            area: this._mazeSize.x * this._mazeSize.y,
            diagonal: Math.sqrt(this._mazeSize.x ** 2 + this._mazeSize.y ** 2)
        };
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

    public set onGenerationChange(handler: () => void) {
        this._onGenerationChange = handler;
    }

    public set onPathFindChange(handler: () => void) {
        this._onPathFindChange = handler;
    }

    public enableStartButton() {
        this._startButton.disabled = false;
    }

    public disableStartButton() {
        this._startButton.disabled = true;
    }
}
