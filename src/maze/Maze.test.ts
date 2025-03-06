import { node } from 'globals';
import { Vec2d } from '../types';
import { Maze } from './Maze';
import { MazeNode } from './MazeNode';

test('Maze size and factory constructor', () => {
    const maze = new Maze({
        size: new Vec2d({ x: 1, y: 2 }),
        nodeFactory: () => {
            return new MazeNode();
        }
    });
    expect(maze.getSize()).toEqual(new Vec2d([1, 2]));
});

test.todo('Maze initialization using collsionState constructor');

test('Maze trasform node to be colliding', () => {
    const maze = new Maze({
        size: new Vec2d({ x: 1, y: 2 }),
        nodeFactory: () => {
            return new MazeNode();
        }
    });

    const pos: Vec2d = { x: 0, y: 1 };

    maze.getNode(pos).makeColliding();

    expect(maze.getNode(pos).isColliding()).toBeTruthy();
});

test.todo('Maze transformEachNode');
