import './maze/Maze';
import { Maze } from './maze/Maze';
import { MazeNode } from './maze/MazeNode';
import { MazePath, Vec2d } from './types';
import MazePathFinder from './maze/MazePathFinder';
import { MazePathFinderNode, MazePathFinderNodeLabel } from './maze/MazePathFinderNode';
import { PrimsStrategy } from './strategies/PrimsStrategy';
import { MazeGenerator } from './maze/MazeGenerator';
import { Random } from './utils/Random';
import chalk from 'chalk';
import { Sleep } from './utils/Sleep';

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { availableStrategies } from './config/strategies';
import { MazePathFindStrategy } from './strategies/MazePathFindStrategy/MazePathFindStrategy';
import { WriteStream } from 'fs';
import { cursorTo } from 'readline';
import { preProcessFile } from 'typescript';

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
    const generator = new MazeGenerator(size.x, size.y);
    const strategy = new PrimsStrategy();
    generator.setGenerationStrategy(strategy);
    const colsate = generator.generateMaze().map(row => {
        return row.map(e => e != 0);
    });

    const maze = new MazePathFinder({
        collsionState: colsate,
        nodeFactory: () => {
            return new MazePathFinderNode();
        }
    });
    const { start, end } = randomizeStartEndPositions(maze);

    return { maze, start, end };
};

const randomizeStartEndPositions = (maze: Maze<MazeNode>): { start: Vec2d; end: Vec2d } => {
    const nonColliding: Vec2d[] = [];

    maze.forEachNode(({ pos, node }) => {
        if (!node.isColliding()) {
            nonColliding.push(pos);
        }
    });

    const start = nonColliding[Random.randomIndex(nonColliding)];

    let end: Vec2d;
    do {
        end = nonColliding[Random.randomIndex(nonColliding)];
    } while (JSON.stringify(start) === JSON.stringify(end));

    return {
        start,
        end
    };
};

const main = (
    strategies: MazePathFindStrategy<MazePathFinderNode>[],
    mazeSize: Vec2d,
    animate: boolean,
    frameDuration: number
) => {
    // const { maze, start, end } = setupMaze();
    const { maze, start, end } = generateMaze(mazeSize);

    // draw generated maze
    console.log(`${maze}`);

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

            //constuct frame
            const statusString = `Changed node at ${JSON.stringify(pos)}\t${getLabelChangeText()}`;

            process.stdout.cursorTo(pos.x, pos.y);
            process.stdout.write(node.toString());

            process.stdout.cursorTo(0, mazeSize.y, () => {});
            process.stdout.write(statusString, () => {});
            process.stdout.clearLine(1);
            process.stdout.moveCursor(-1000, 1);
            console.table(maze.getStats());

            // process.stdout.cursorTo(0, 0);

            const mazeString = `${maze.toString()}`;

            // clear terminal
            // console.clear();
            // draw
            // console.log(statusString);
            // draw stats table

            Sleep.msleep(frameDuration);
        });
    }

    for (const strategy of strategies) {
        maze.setPathFindStrategy(strategy);
        const path = maze.findPath(start, end);

        // clear last frame if prgoress is drawn
        console.table(animate);
        if (animate) {
            process.stdout.cursorTo(0, 0);

            // process.stdout.write(`${maze.toString()}`);
        } else {
            // console.log('-----------------------------');
            // console.log('Using strategy', Object.getPrototypeOf(strategy).constructor.name);
            maze.toString();
            // console.table(maze.getStats());
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

// parese strategy names
const strategies = options.strategy.reduce(
    (acc: MazePathFindStrategy<MazePathFinderNode>[], strategyToFind: string) => {
        strategyOptions.forEach((strategyImpl, strategyName) => {
            // console.log('looking for', strategyToFind);
            if ((strategyToFind as string).toLowerCase() === strategyName.toLowerCase()) {
                console.log('using', strategyName);
                acc.push(strategyImpl);
            }
        });
        return acc;
    },
    []
);

main(strategies, mazeSize, animate, frameDuration);
