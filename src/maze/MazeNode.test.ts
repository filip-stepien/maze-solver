import { MazeNode } from './MazeNode';
import { test, expect } from 'vitest';

test('make mazeNode colliding', () => {
    const node = new MazeNode();
    node.makeColliding();
    expect(node.isColliding()).toBe(true);
});

test('make mazeNode not colliding', () => {
    const node = new MazeNode();
    node.makeNotColliding();
    expect(node.isColliding()).toBe(false);
});

test('MazeNode clone is not returning itself', () => {
    const node = new MazeNode();
    const node2 = node.clone();
    expect(node === node2).toBeFalsy();
});
