import { transform } from 'typescript';
import './maze/Maze';
import { Maze, MazeNode } from './maze/Maze';
import { Vec2d } from './types';

const maze = new Maze({
    size: new Vec2d({ x: 5, y: 5 }),
    initializer: new MazeNode({ isSolid: true })
});

// console.log(maze);

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
    console.debug('main(): setting ', e);
    const pos = new Vec2d({
        x: e[0],
        y: e[1]
    });

    maze.transformNode(pos, node => {
        node.setIsSolid(false);
        return node;
    });
});

console.log(maze.toString());
// console.dir(maze, { depth: null });
