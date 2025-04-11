import { MazePathFinderNode } from '../../../maze/MazePathFinderNode';
import { BlankMazeStrategy } from '../../../strategies/generation/BlankMazeStrategy';
import { GenerationStrategy } from '../../../strategies/generation/GenerationStrategy';
import { PredefinedMazeStrategy } from '../../../strategies/generation/PredefinedMazeStrategy';
import { PrimsStrategy } from '../../../strategies/generation/PrimsStrategy';
import { AStarStrategy } from '../../../strategies/MazePathFindStrategy/AStarStrategy';
import { BFSStrategy } from '../../../strategies/MazePathFindStrategy/BFSStrategy';
import { DFSStrategy } from '../../../strategies/MazePathFindStrategy/DFSStrategy';
import { MazePathFindStrategy } from '../../../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { Vec2d } from '../../../types';
import { Button } from '../../controls/Button';
import { DropDown } from '../../controls/DropDown';
import { FileSelect } from '../../controls/FileSelect';
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
    private _saveButton = new Button('Save');
    private _fileSelect = new FileSelect();

    // control handlers
    private _onStart: () => void = function () {};
    private _onRestart: () => void = function () {};
    private _onGenerationChange: (label: string) => void = function () {};
    private _onPathFindChange: (label: string) => void = function () {};
    private _onMazeLoad: () => void = function () {};
    private _onSave: () => void = function () {};

    constructor() {
        this.initSizeInputs();
        this.initStartButton();
        this.initResetButton();
        this.initDropDowns();
        this.initSaveButton();
        this.initFileSelect();
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

    private initFileSelect() {
        this._fileSelect.onChange = fileContent => {
            const mazeStructureRegex = /^(0|1|,|(\r?\n))*$/;

            const hasCorrectCharacters = mazeStructureRegex.test(fileContent);
            if (!hasCorrectCharacters) {
                console.warn(
                    'Failed to parse the maze from the file.' +
                        'The file has invalid characters. ' +
                        'Valid characters are: `0`, `1`, `s`, `e`, `,` and newline characters.'
                );
                return;
            }

            const maze = fileContent
                .split(/\r?\n/)
                .map(row => row.split(',').map(wall => Boolean(JSON.parse(wall))));

            const invalidRowIdx = maze.findIndex(row => row.length !== maze[0].length);
            if (invalidRowIdx !== -1) {
                console.warn(
                    'Failed to parse the maze from the file. ' +
                        'Row sizes are inconsistent. ' +
                        `Row at line ${invalidRowIdx + 1} has ${
                            maze[invalidRowIdx].length
                        } elements, ` +
                        `while the first row contains ${maze[0].length} elements.`
                );
                return;
            }

            if (maze.length < 10 || maze[0].length < 10) {
                console.warn(
                    'Failed to parse the maze from the file. The maze must be at least 10x10.'
                );
                return;
            }

            const hasAtLeastTwoPathNodes = maze.flat().filter(node => !node).length;
            if (!hasAtLeastTwoPathNodes) {
                console.warn(
                    'Failed to parse the maze from the file. The maze must have at least 2 path nodes.'
                );
                return;
            }

            this._mazeSize = new Vec2d([maze.length, maze[0].length]);
            this._sizeInputX.value = maze.length;
            this._sizeInputY.value = maze[0].length;
            this._generationStrategy = new PredefinedMazeStrategy(maze);
            this._onMazeLoad();
        };
    }

    public initSaveButton() {
        this._saveButton.onChange = () => {
            this._onSave();
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

    public set onMazeLoad(handler: () => void) {
        this._onMazeLoad = handler;
    }

    public set onSave(handler: () => void) {
        this._onSave = handler;
    }

    public enableStartButton() {
        this._startButton.disabled = false;
    }

    public disableStartButton() {
        this._startButton.disabled = true;
    }
}
