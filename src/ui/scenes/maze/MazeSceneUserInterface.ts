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
import { LegacyBadMazeSerializer } from './MazeSerializer';
import { Text } from '../../controls/Text';
import { Control } from '../../controls/Control';
import { View } from '../../controls/View';
import { stat } from 'fs';
import { KruskalsStrategy } from '../../../strategies/generation/KrushalsStrategy';
import { DFSGenerationStategy } from '../../../strategies/generation/DFSGenerationStrategy';

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
        "Prim's Algorithm": new PrimsStrategy(),
        'Kruskal': new KruskalsStrategy(),
        'DFS': new DFSGenerationStategy()
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

    private _forsakenCount = new Text('0');
    private _queuedCount = new Text('0');
    private _candidateCount = new Text('0');
    private _selectedCount = new Text('0');

    // control handlers
    private _onStart: () => void = function () {};
    private _onLayoutRestart: () => void = function () {};
    private _onAlgorithmRestart: () => void = function () {};
    private _onGenerationChange: (label: string) => void = function () {};
    private _onPathFindChange: (label: string) => void = function () {};
    private _onMazeLoad: (start: Vec2d, finish: Vec2d) => void = function () {};
    private _onSave: () => void = function () {};

    constructor() {
        this.initSizeInputs();
        this.initStartButton();
        this.initLayoutResetButton();
        this.initAlgorithmResetButton();
        this.initDropDowns();
        this.initSaveButton();
        this.initFileSelect();
        this.initMenuLayout();
        this.initStatsLayout();
    }

    private initMenuLayout() {
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
            background: 'rgba(255, 255, 255, 0.25)',
            position: 'absolute',
            top: '0',
            left: '0'
        };

        const help = new Button('Controls Help');
        help.onChange = () => {
            alert(
                'Controls:\n' +
                    'Left Click - place block\n' +
                    'Right Click - destroy block\n' +
                    'Shift + Left Click - change start position\n' +
                    'Ctrl + Left Click - change end position'
            );
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
            help,
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
        this._sizeInputX.max = 10000;

        this._sizeInputY.value = 10;
        this._sizeInputY.min = 3;
        this._sizeInputY.max = 10000;

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
            document.body.style.cursor = 'not-allowed';
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
            document.body.style.cursor = 'auto';
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
            const mazeFile = LegacyBadMazeSerializer.load(fileContent);
            if (!mazeFile) return;

            const { maze, start, finish } = mazeFile;
            this._mazeSize = new Vec2d([maze.length, maze[0].length]);
            this._sizeInputX.value = maze.length;
            this._sizeInputY.value = maze[0].length;
            this._generationStrategy = new PredefinedMazeStrategy(maze);
            this._onMazeLoad(start, finish);
        };
    }

    private initSaveButton() {
        this._saveButton.onChange = () => {
            this._onSave();
        };
    }

    private initStatsLayout() {
        const column = (title: string, color: string, child: Text) => {
            const flex = new FlexView();
            flex.width = 80;
            flex.direction = 'column';
            flex.alignItems = 'center';

            const text = new Text(title);
            text.color = child.color = 'white';
            text.fontSize = child.fontSize = '10pt';
            text.style = { fontWeight: 'bold' };

            flex.addChild(text, child);

            const container = new View();
            container.padding = 5;
            container.style = { background: color };
            container.addChild(flex);

            return container;
        };

        const columnContainer = new FlexView();
        columnContainer.addChild(
            column('Selected', 'rgba(40, 167, 69)', this._selectedCount),
            column('Candidate', 'rgb(225, 221, 0)', this._candidateCount),
            column('Queued', '#ffa500', this._queuedCount),
            column('Forsaken', 'rgb(220, 53, 69)', this._forsakenCount)
        );

        const title = new Text('Simulation Statistics');
        title.color = 'white';

        const help = new Button('Help');
        help.onChange = () => {
            alert(
                'Selected - node has been chosen by the algorithm as part of the final path.\n\n' +
                    'Candidate - node is currently under consideration and might be included in the final path.\n\n' +
                    'Queued – node has been added to the processing queue and may become a candidate, unless the algorithm terminates before reaching it.\n\n' +
                    'Forsaken - node was previously considered a candidate but has since been discarded by the algorithm.'
            );
        };

        const titleContainer = new FlexView();
        titleContainer.alignItems = 'center';
        titleContainer.justifyContent = 'space-between';
        titleContainer.addChild(title, help);

        const layout = new FlexView();
        layout.direction = 'column';
        layout.width = 'fit-content';
        layout.padding = 10;
        layout.gap = 10;
        layout.style = {
            background: 'rgba(255, 255, 255, 0.25)',
            position: 'absolute',
            left: '0',
            bottom: '0'
        };

        layout.addChild(titleContainer, columnContainer);
    }

    public setStats(stats: {
        candidate: number;
        forsaken: number;
        selected: number;
        queued: number;
    }) {
        this._candidateCount.content = stats.candidate.toString();
        this._forsakenCount.content = stats.forsaken.toString();
        this._selectedCount.content = stats.selected.toString();
        this._queuedCount.content = stats.queued.toString();
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

    public set onMazeLoad(handler: (start: Vec2d, finish: Vec2d) => void) {
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
