import { transform } from 'typescript';
import './maze/Maze';
import { Maze, MazeNode } from './maze/Maze';
import { Vec2d } from './types';
import MazePathFinder, { MazePathFinderNode } from './maze/MazePathFinder';

const setupMaze = () => {
    console.debug('initializer: ', MazeNode.initializer);

    const maze = new Maze({
        size: new Vec2d({ x: 5, y: 5 }),
        initializer: MazeNode.initializer
    });

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
            node.setIsSolid(false);
            return node;
        });
    });
    return maze;
};

// const mpf = new MazePathFinder(maze);
// console.dir(maze, { depth: null });

const findPath = (maze: Maze<MazeNode>) => {
    const mpf = new MazePathFinder(maze, MazePathFinderNode.initializer);
    // console.debug(mpf);
    console.dir(mpf, { depth: null });
};

const main = () => {
    const maze = setupMaze();
    console.log('-----------------------------');
    console.log(maze.toString());
    console.log('-----------------------------');
    findPath(maze);
};
export default main;

main();
