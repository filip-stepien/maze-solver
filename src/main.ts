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

const setupMaze = () => {
    console.debug('initializer: ', MazeNode.initializer);

    console.info('creatig maze');
    const maze = new MazePathFinder({
        size: new Vec2d({ x: 5, y: 6 }),
        nodeFactory: () => {
            return new MazePathFinderNode();
        }
    });

    console.info('making every maze node solid');
    maze.forEachNode(({ node }) => {
        node.makeColliding();
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
        maze.getNode(pos).makeNotColliding();
    });
    return maze;
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

    return maze;
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
    // const maze = setupMaze();
    const maze = generateMaze(new Vec2d([60, 15]));
    console.log('-----------------------------');
    console.info('drawing maze using toString');
    console.log(`${maze}`);

    const strategies = [
        //
        // new BFSStrategy(),
        //
        // new DFSStrategy(),
        new AStarStrategy()
    ];

    // FIXME temp disable for debuuging
    const forceDoNotDrawProgress = false;
    // FIXME
    const forceDoNotClearOnDrawProgress = true;

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
            function msleep(n: number) {
                Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
            }

            const string = `Changed node at ${JSON.stringify(pos)}, ${
                node.hasLabel(labelChanged)
                    ? chalk.green(`+ ${labelChanged}`)
                    : chalk.red(`- ${labelChanged}`)
            }\n${maze.toString()}`;
            if (!forceDoNotClearOnDrawProgress) console.clear();
            console.log(string);
            printStats();
            msleep(10);
            if (node.hasLabel('finish')) msleep(5000);
        });

    const { start, end } = randomizeStartEndPositions(maze);

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
