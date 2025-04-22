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
import { FlexView } from '../../controls/FlexView';
import { NumberInput } from '../../controls/NumberInput';
import { MazeSerializer } from './MazeSerializer';
import { Text } from '../../controls/Text';
import { Control } from '../../controls/Control';
import { View } from '../../controls/View';

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
    private _resetLayoutButton = new Button('Reset layout');
    private _resetAlgorithmButton = new Button('Restart');
    private _startButton = new Button('Start');
    private _generationStrategyDropDown = new DropDown();
    private _pathFindStrategyDropDown = new DropDown();
    private _saveButton = new Button('Save');
    private _fileSelect = new FileSelect();
    private _helpButton = new Button('Controls Help');

    // control handlers
    private _onStart: () => void = function () {};
    private _onLayoutRestart: () => void = function () {};
    private _onAlgorithmRestart: () => void = function () {};
    private _onGenerationChange: (label: string) => void = function () {};
    private _onPathFindChange: (label: string) => void = function () {};
    private _onMazeLoad: () => void = function () {};
    private _onSave: () => void = function () {};

    constructor() {
        this.initSizeInputs();
        this.initStartButton();
        this.initLayoutResetButton();
        this.initAlgorithmResetButton();
        this.initDropDowns();
        this.initSaveButton();
        this.initFileSelect();
        this.initHelpButton();
        this.initLayout();
    }

    private initHelpButton() {
        this._helpButton.onChange = () => {
            const help =
                'Controls:\n' +
                'Left Click - place block\n' +
                'Right Click - destroy block\n' +
                'Shift + Left Click - change start position\n' +
                'Ctrl + Left Click - change end position\n';

            alert(help);
        };
    }

    private initLayout() {
        const oneColumnFlex = (...children: Control[]) => {
            const flex = new FlexView();
            flex.direction = 'column';
            flex.gap = 5;
            flex.addChild(...children);
            return flex;
        };

        const twoColumnFlex = (child1: Control, child2: Control) => {
            const flex = new FlexView();
            flex.gap = 5;
            flex.alignItems = 'center';
            flex.addChild(child1, child2);

            child1.style = child2.style = { flex: '1' };
            return flex;
        };

        const title = (label: string) => {
            const text = new Text(label);
            text.color = 'white';
            text.fontSize = '10pt';
            return text;
        };

        const subtitle = (label: string) => {
            const text = new Text(label);
            text.color = 'rgba(255, 255, 255, 0.75)';
            text.fontSize = '8pt';
            text.align = 'center';
            return text;
        };

        const header = (label: string) => {
            const text = new Text(label);
            text.color = 'white';
            text.fontSize = '12pt';
            text.align = 'center';
            return text;
        };

        const layout = new FlexView();
        layout.direction = 'column';
        layout.gap = 10;
        layout.padding = 8;
        layout.width = 'fit-content';
        layout.style = {
            background: 'rgba(255, 255, 255, 0.25)'
        };

        this._fileSelect.style = this._startButton.style = {
            color: 'white',
            textAlign: 'center',
            fontSize: '13.3px',
            background: 'rgb(0, 123, 255)',
            padding: '1px 6px 1px 6px',
            border: '1.6px solid rgb(0, 123, 255)'
        };

        this._sizeInputX.width = this._sizeInputY.width = 40;

        layout.addChild(
            header('Maze Pathfinding Visualizer'),
            subtitle('Authors: Filip Stępień, Rafał Grot'),
            this._helpButton,
            oneColumnFlex(title('Maze generation strategy'), this._generationStrategyDropDown),
            oneColumnFlex(title('Path find strategy'), this._pathFindStrategyDropDown),
            oneColumnFlex(
                title('Layout size'),
                twoColumnFlex(
                    twoColumnFlex(this._sizeInputX, this._sizeInputY),
                    this._resetLayoutButton
                )
            ),
            oneColumnFlex(
                title('Save / upload maze'),
                twoColumnFlex(this._saveButton, this._fileSelect)
            ),
            oneColumnFlex(
                title('Simulation controls'),
                twoColumnFlex(this._resetAlgorithmButton, this._startButton)
            )
        );
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

    private initLayoutResetButton() {
        this._resetLayoutButton.onChange = () => {
            if (this._sizeInputX.validate(true) && this._sizeInputY.validate(true)) {
                this._onLayoutRestart();
            }
        };
    }

    private initAlgorithmResetButton() {
        this._resetAlgorithmButton.onChange = () => {
            this._onAlgorithmRestart();
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
            const maze = MazeSerializer.load(fileContent);
            if (!maze) return;

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

    public set onAlgorithmRestart(handler: () => void) {
        this._onAlgorithmRestart = handler;
    }

    public set onLayoutRestart(handler: () => void) {
        this._onLayoutRestart = handler;
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
