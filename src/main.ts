import './maze/Maze';
import { MazeNode } from './maze/MazeNode';
import { Vec2d } from './types';
import MazePathFinder from './maze/MazePathFinder';
import { MazePathFinderNode } from './maze/MazePathFinderNode';
import { PrimsStrategy } from './strategies/PrimsStrategy';

import chalk from 'chalk';
import { Sleep } from './utils/Sleep';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { availableStrategies } from './config/strategies';
import { MazePathFindStrategy } from './strategies/MazePathFindStrategy/MazePathFindStrategy';
import { GodClassAntiPattern } from './maze/godClassAntiPattern';

const setupMaze = () => {
    console.debug('initializer: ', MazeNode.initializer);

    console.info('creatig maze');
    const maze = new MazePathFinder({
        size: new Vec2d({ x: 50, y: 20 }),
        nodeFactory: () => {
            return new MazePathFinderNode();
        }
    });

    console.info('making every maze node solid');
    maze.forEachNode(({ node }) => {
        // node.makeColliding();
    });

    console.info('setting some maze nodes to not solid');
    [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 3],
        [1, 4],
        [0, 4],
        [2, 1],
        [2, 2],
        [1, 2],
        [0, 2],
        [3, 1],
        [4, 1],
        [4, 0],
        [2, 4],
        [3, 4],
        [4, 4],
        [3, 3],
        [0, 5],
        [1, 5],
        [2, 5],
        [4, 5]
    ].forEach(e => {
        const pos = new Vec2d(e);
        maze.getNode(pos.move(new Vec2d([5, 5]))).makeColliding();
    });
    return { start: new Vec2d([0, 0]), end: new Vec2d([30, 15]), maze };
};

const generateMaze = (size: Vec2d) => {
    const god: GodClassAntiPattern = new GodClassAntiPattern();
    god.setGeneratorStrategy(new PrimsStrategy());
    god.generateMaze(size);
    const maze = god.getMazePathFinderImplementationDetailGetterAntiPattern();
    const { start, end } = god.randomizeStartEndPositions();

    return { maze, start, end };
};

const main = (
    strategies: MazePathFindStrategy<MazePathFinderNode>[],
    mazeSize: Vec2d,
    animate: boolean,
    frameDuration: number,
    maximize: boolean
) => {
    const placeHolderMaze = new MazePathFinder({
        nodeFactory: () => {
            return new MazePathFinderNode();
        },
        size: new Vec2d([1, 1])
    });

    const generateUsingStrategyString = (strategy: MazePathFindStrategy<MazePathFinderNode>) => {
        return `${Object.getPrototypeOf(strategy)?.constructor?.name}`;
    };

    const generateInfoBanner = (strategy: MazePathFindStrategy<MazePathFinderNode>) => {
        let statusBanner = '';
        statusBanner += `${generateUsingStrategyString(strategy)}`;

        return statusBanner;
    };

    const statsRows = Object.keys(placeHolderMaze.getStats()).length;

    const infoBannerRows = generateInfoBanner(availableStrategies[0]).split('\n').length;

    const reserverdRows =
        // info banner offset
        infoBannerRows +
        // stats entries count is same for any maze so just craete placeholer to get it
        statsRows +
        // status table borders
        +6;

    const finallMazeSize = new Vec2d({
        x: maximize ? process.stdout.columns : mazeSize.x,
        y: maximize ? process.stdout.rows - reserverdRows : mazeSize.y
    });

    const prepareForAnimation = (strategy: MazePathFindStrategy<MazePathFinderNode>) => {
        // create banner
        const statusBanner = generateInfoBanner(strategy);
        // comute space needed for banner
        const statusOffset = statusBanner.split('\n').length;

        //check if it fits
        if (process.stdout.columns < mimimumColsNeeded) {
            throw Error(
                `Terminal has too few columns (${chalk.red(
                    process.stdout.columns
                )}), required ${chalk.yellow(mimimumColsNeeded)}.`
            );
        }
        if (process.stdout.rows < minimumRowsNeeded) {
            throw Error(
                `Terminal has too few rows (${chalk.red(
                    process.stdout.rows
                )}), required ${chalk.yellow(minimumRowsNeeded)}.`
            );
        }

        // write stuff
        console.clear();
        process.stdout.cursorTo(0, 0);
        maze.resetNodeLabels();
        process.stdout.write(maze.toString());
        process.stdout.write(statusBanner);
        process.stdout.moveCursor(-999999, 1);
    };

    const { maze, start, end } = generateMaze(finallMazeSize);
    maze.getNode(start).makeStart();
    maze.getNode(end).makeFinish();
    // const { maze, start, end } = setupMaze();

    const minimumRowsNeeded = maze.getSize().y + reserverdRows;
    const mimimumColsNeeded = maze.getSize().x;

    // const { maze, start, end } = generateMaze(mazeSize);

    if (animate) {
        // on each label change
        process.stdout.cursorTo(0, 0);
        process.stdout.clearScreenDown();
        process.stdout.cursorTo(0, 0);
        process.stdout.write(`${maze}`);

        maze.addNodeLabelChangeObserver(({ node, pos, labelChanged }) => {
            // skip removing labels
            // if (!node.hasLabel(labelChanged)) return;

            const getLabelChangeText = () => {
                return node.hasLabel(labelChanged)
                    ? chalk.green(`+ ${labelChanged}`)
                    : chalk.red(`- ${labelChanged}`);
            };

            process.stdout.cursorTo(pos.x, pos.y);
            process.stdout.write(node.toString());

            // status banner
            const statusString =
                'Changed node at' + `\t${JSON.stringify(pos)}\t\t${getLabelChangeText()}\n`;

            // go to status string
            process.stdout.cursorTo(0, maze.getSize().y + infoBannerRows, () => {});
            process.stdout.clearLine(1);
            process.stdout.write(statusString, () => {});
            // under status write stats
            // process.stdout.moveCursor(-100, -3);
            console.table(maze.getStats());

            Sleep.msleep(frameDuration);
        });
    }

    if (!animate) {
        // draw generated maze
        console.log('Maze');
        console.log(maze.toString());
    }

    for (const strategy of strategies) {
        if (animate) {
            try {
                prepareForAnimation(strategy);
            } catch (error) {
                console.log('Animating failed', error);
                process.exit(2);
            }
        }

        const path = maze.findPath(strategy, start, end);

        if (!animate) {
            console.log('-----------------------------');
            process.stdout.write(generateUsingStrategyString(strategy) + '\n');
            console.log(maze.toString());
            console.table(maze.getStats());
        }

        // display maze
        // stats
    }
};

export default main;

// main();

/**
 * map of strategies as strings for option flags and their implemntations
 */
const strategyOptions = availableStrategies.reduce((map, strategy) => {
    const strategyStringRepresentation = Object.getPrototypeOf(strategy).constructor.name.replace(
        /Strategy/,
        ''
    );
    map.set(strategyStringRepresentation, strategy);
    return map;
}, new Map<string, MazePathFindStrategy<MazePathFinderNode>>());

const optionDefinitions = [
    {
        name: 'animate',
        alias: 'a',
        type: Boolean,
        defaultValue: false,
        description: 'animate solving'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        defaultValue: false,
        description: 'show help and exit'
    },
    {
        name: 'strategy',
        alias: 's',
        type: String,
        lazyMultiple: true,
        description:
            'solving stratgy to use (case insensitive). Use --strategy-list to see allowed values. Can be specified multiple times to use few. If none set all stretegies avilable will be used.',
        defaultValue: Array.from(strategyOptions.keys())
    },
    {
        name: 'strategy-list',
        alias: 'S',
        type: Boolean,
        description: 'list solving strategies'
    },
    {
        name: 'frame-duration',
        alias: 'f',
        type: Number,
        description: 'minimum frame duration when animating in ms',
        defaultValue: 100
    },
    {
        name: 'height',
        alias: 'y',
        type: Number,
        description: 'height of maze',
        defaultValue: 25
    },
    {
        name: 'width',
        alias: 'x',
        type: Number,
        description: 'width of maze',
        defaultValue: 50
    },
    {
        name: 'maximize',
        alias: 'm',
        type: Boolean,
        description: 'set maze size to maximum that fits within terminal',
        defaultValue: false
    }
];
const sections = [
    {
        header: 'Usage',
        optionList: optionDefinitions
    }
];

const showHelpAndExit = () => {
    const usage = commandLineUsage(sections);
    console.log(usage);
    process.exit(1);
};

let options;
try {
    options = commandLineArgs(optionDefinitions);
} catch (exception) {
    // console.log(exception);
    console.log(exception.name, exception.optionName);
    showHelpAndExit();
}
// console.log(options);

if (options.help === true) {
    showHelpAndExit();
}
if (options['strategy-list'] === true) {
    // showing strategy list
    console.log('Avilable strategies:\n\t' + Array.from(strategyOptions.keys()).join(' '));
    process.exit(0);
}

const mazeSize: Vec2d = new Vec2d([options.width, options.height]);
const frameDuration: number = options['frame-duration'];
const animate: boolean = options.animate;
const maximize: boolean = options.maximize;

// parese strategy names
const strategies = options.strategy.reduce(
    (acc: MazePathFindStrategy<MazePathFinderNode>[], strategyToFind: string) => {
        strategyOptions.forEach((strategyImpl, strategyName) => {
            // console.log('looking for', strategyToFind);
            if ((strategyToFind as string).toLowerCase() === strategyName.toLowerCase()) {
                // console.log('using', strategyName);
                acc.push(strategyImpl);
            }
        });
        return acc;
    },
    []
);

main(strategies, mazeSize, animate, frameDuration, maximize);
