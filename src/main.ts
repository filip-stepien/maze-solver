import { transform } from 'typescript';
import './maze/Maze';
import { Maze, MazeNode } from './maze/Maze';
import { Vec2d } from './types';
import MazePathFinder, { MazePathFinderNode } from './maze/MazePathFinder';
import { BFSStrategy } from './strategies/MazePathFindStrategy/BFSStrategy';

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
    maze.transformEachNode(e => {
        e.makeSolid();
        return e;
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
        [3, 3]
    ].forEach(e => {
        const pos = new Vec2d({
            x: e[0],
            y: e[1]
        });

        maze.transformNode(pos, node => {
            node.makeNotSolid();
            return node;
        });
    });
    return maze;
};

const findPath = (maze: MazePathFinder<MazePathFinderNode>) => {
    const mpf = maze;
    console.info(`initialzied ${Object.getPrototypeOf(mpf).constructor.name}`);
    const strategy = new BFSStrategy();
    mpf.setPathFindStrategy(strategy);
    console.info(
        `${Object.getPrototypeOf(mpf).constructor.name} strategy set ${
            Object.getPrototypeOf(strategy).constructor.name
        }`
    );

    mpf.findPath(new Vec2d([0, 0]), new Vec2d([3, 3]));
    console.dir(mpf, { depth: null });
};

const main = () => {
    const maze = setupMaze();
    console.log('-----------------------------');
    console.info('drawing maze using toString');
    console.log(`${maze}`);
    console.log('-----------------------------');
    console.info('finding path');
    findPath(maze);
};
export default main;

main();
