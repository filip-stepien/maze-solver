import { transform } from 'typescript';
import './maze/Maze';
import { Maze } from './maze/Maze';
import { MazeNode } from './maze/MazeNode';
import { Vec2d } from './types';
import MazePathFinder from './maze/MazePathFinder';
import { MazePathFinderNode } from './maze/MazePathFinderNode';
import { BFSStrategy } from './strategies/MazePathFindStrategy/BFSStrategy';
import { PrimsStrategy } from './strategies/PrimsStrategy';
import { MazeGenerator } from './maze/MazeGenerator';
import { Random } from './utils/Random';

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

const generateMaze = () => {
    const generator = new MazeGenerator(66, 17);
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

const findPath = (maze: MazePathFinder<MazePathFinderNode>) => {
    const mpf = maze;
    console.info(`initialzied ${Object.getPrototypeOf(mpf).constructor.name}`);
    const strategy = new BFSStrategy();
    mpf.setPathFindStrategy(strategy);
    console.info(
        `${Object.getPrototypeOf(mpf).constructor.name} strategy set to ${
            Object.getPrototypeOf(strategy).constructor.name
        }`
    );

    const { start, end } = randomizeStartEndPositions(mpf);

    mpf.findPath(start, end);
    console.log(`${mpf}`);
    // console.dir(mpf, { depth: null });
};

const main = () => {
    // const maze = setupMaze();
    const maze = generateMaze();
    console.log('-----------------------------');
    console.info('drawing maze using toString');
    console.log(`${maze}`);
    console.log('-----------------------------');
    console.info('finding path');
    findPath(maze);
};
export default main;

main();
