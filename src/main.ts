import './maze/Maze';
import { Maze } from './maze/Maze';
import { MazeNode } from './maze/MazeNode';
import { MazePath, Vec2d } from './types';
import MazePathFinder from './maze/MazePathFinder';
import { MazePathFinderNode, MazePathFinderNodeLabel } from './maze/MazePathFinderNode';
import { BFSStrategy } from './strategies/MazePathFindStrategy/BFSStrategy';
import { PrimsStrategy } from './strategies/PrimsStrategy';
import { MazeGenerator } from './maze/MazeGenerator';
import { Random } from './utils/Random';
import { DFSStrategy } from './strategies/MazePathFindStrategy/DFSStrategy';
import chalk from 'chalk';
import { AStarStrategy } from './strategies/MazePathFindStrategy/AStarStrategy';
import { FlatESLint } from 'eslint/use-at-your-own-risk';
import { Sleep } from './utils/Sleep';

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

const main = () => {
    // const { maze, start, end } = setupMaze();
    const { maze, start, end } = generateMaze(new Vec2d([90, 35]));
    console.log('-----------------------------');
    console.info('drawing maze using toString');
    console.log(`${maze}`);

    const strategies = [
        //
        new BFSStrategy(),
        //
        new DFSStrategy(),
        new AStarStrategy()
    ];

    // FIXME temp disable for debuuging
    const forceDoNotDrawProgress = false;
    // FIXME
    const forceDoNotClearOnDrawProgress = false;

    const doDrawProgress = !forceDoNotDrawProgress && strategies.length <= 1;

    const printStats = () => {
        const countLabeled = (label: MazePathFinderNodeLabel) => {
            let counter = 0;
            maze.forEachNode(({ node }) => {
                if (node.hasLabel(label)) {
                    ++counter;
                }
            });
            return counter;
        };

        const stats = {
            // How many times candidates are there
            candidated: countLabeled('candidate'),
            forsaken: countLabeled('forsaken'),
            queued: countLabeled('queued'),
            selected: countLabeled('selected')
        };
        console.table(stats);
    };

    if (doDrawProgress)
        // Drawing on each label change
        maze.addNodeLabelChangeObserver(({ node, pos, labelChanged }) => {
            // skip removing labels
            if (!node.hasLabel(labelChanged)) return;

            const string = `Changed node at ${JSON.stringify(pos)}, ${
                node.hasLabel(labelChanged)
                    ? chalk.green(`+ ${labelChanged}`)
                    : chalk.red(`- ${labelChanged}`)
            }\n${maze.toString()}`;
            if (!forceDoNotClearOnDrawProgress) console.clear();
            console.log(string);
            printStats();
            Sleep.msleep(50);
        });

    for (const strategy of strategies) {
        console.log('-----------------------------');

        console.log('Using strategy', Object.getPrototypeOf(strategy).constructor.name);

        maze.setPathFindStrategy(strategy);
        const path = maze.findPath(start, end);
        // clear last frame if prgoress is drawn
        if (doDrawProgress) {
            console.clear();
        }
        console.log(`\n${maze.toString()}`);
        printStats();
    }
};
export default main;

main();
