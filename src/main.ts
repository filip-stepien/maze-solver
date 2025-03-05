import './maze/Maze';
import { Maze, MazeNode } from './maze/Maze';

const maze = new Maze({ x: 5, y: 3, initializer: new MazeNode({ isSolid: true }) });

console.log(maze);

maze.transformNode(1, 1, (node: MazeNode) => {
    node.setIsSolid(false);
    return node;
});

console.log(maze.toString());

console.log('ziutek');
