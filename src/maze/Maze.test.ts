import { Vec2d } from '../types';
import { Maze, MazeNode } from './Maze';

test('test maze size factory constructor', () => {
    const maze = new Maze({
        size: new Vec2d({ x: 1, y: 2 }),
        nodeFactory: () => {
            return new MazeNode();
        }
    });
    expect(maze.getSize()).toEqual(new Vec2d([1, 2]));
});
