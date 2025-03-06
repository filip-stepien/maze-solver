import { Vec2d } from '../types';
import { Maze } from './Maze';
import { MazeNode } from './MazeNode';
import { test, describe, beforeEach, beforeAll, expect, assert } from 'vitest';

test('Maze size and factory constructor', () => {
    const maze = new Maze({
        size: new Vec2d({ x: 1, y: 2 }),
        nodeFactory: () => {
            return new MazeNode();
        }
    });
    expect(maze.getSize()).toEqual(new Vec2d([1, 2]));
});

test('Maze initialization using collsionState constructor', () => {
    const data: number[][] = [
        [0, 0, 1, 1, 0],
        [1, 0, 1, 0, 0],
        [0, 0, 0, 0, 1]
    ];

    const colsate = data.map(row => {
        return row.map(e => e != 0);
    });

    const maze = new Maze({
        collsionState: colsate,
        nodeFactory: () => {
            return new MazeNode();
        }
    });

    for (let y = 0; y < colsate.length; ++y) {
        for (let x = 0; x < colsate[y].length; ++x) {
            expect(maze.getNode(new Vec2d({ x, y })).isColliding()).toBe(colsate[y][x]);
        }
    }
});

test('Maze size and collsionState matrix in constructor throws ', () => {
    expect(() => {
        new Maze({
            size: new Vec2d({ x: 1, y: 2 }),
            nodeFactory: () => {
                return new MazeNode();
            },
            collsionState: [[true], [false]]
        });
    }).toThrow();
});

test('Maze forEachNode works', () => {
    const maze = new Maze({
        size: new Vec2d({ x: 2, y: 3 }),
        nodeFactory: () => {
            return new MazeNode();
        }
    });

    const nodeList = Array.from([
        // first
        [0, 0],
        //last
        [1, 2],
        //somewhere in middle
        [0, 1]
    ]);

    nodeList
        .map(e => new Vec2d(e))
        .forEach(pos => {
            maze.getNode(pos).makeColliding();
        });

    maze.forEachNode(({ pos, node }) => {
        const shouldBeColliding = nodeList.some(e => {
            return e[0] == pos.x && e[1] == pos.y;
        });

        expect(node.isColliding() == shouldBeColliding).toBeTruthy();
    });
});

describe('Maze methods', () => {
    let size: Vec2d;
    let maze: Maze<MazeNode>;

    beforeEach(() => {
        size = new Vec2d([2, 3]);
        maze = new Maze({
            size,
            nodeFactory: () => {
                return new MazeNode();
            }
        });
    });

    test('Maze trasform node to be colliding', () => {
        const pos: Vec2d = new Vec2d({ x: 1, y: 2 });
        maze.getNode(pos).makeColliding();
        expect(maze.getNode(pos).isColliding()).toBeTruthy();
    });

    test('Maze getSize returns correct value', () => {
        expect(JSON.stringify(maze.getSize()) === JSON.stringify(size)).toBeTruthy();
    });

    test("Maze getSize owns it's size", () => {
        size.x = 69;

        expect(JSON.stringify(maze.getSize()) !== JSON.stringify(size)).toBeTruthy();
    });
});

describe('getAdjacientNodes returns correct results', () => {
    let maze: Maze<MazeNode>;

    function testPostions(origin: Vec2d, validPositions: Vec2d[]) {
        // get adjacent nodes
        // console.log(origin);
        const nodes = maze.getAdjacentNodes(origin);
        // console.log(nodes);

        // Assert that each returned node postion is one of correct ones
        nodes.forEach(mazeNodeIterator => {
            expect(JSON.stringify(mazeNodeIterator.pos)).oneOf(
                validPositions.map(e => JSON.stringify(e))
            );
        });
    }

    beforeAll(() => {
        maze = new Maze({
            // keep it miniumum 4x4
            size: new Vec2d({ x: 7, y: 4 }),
            nodeFactory: () => {
                return new MazeNode();
            }
        });
    });

    test('top left', () => {
        const origin = new Vec2d([0, 0]);
        testPostions(
            origin,
            [
                [1, 0],
                [0, 1]
            ].map(offset => origin.move(new Vec2d(offset)))
        );
    });

    test('top right', () => {
        const origin = new Vec2d([maze.getSize().x - 1, 0]);
        testPostions(
            origin,
            [
                [-1, 0],
                [0, 1]
            ].map(offset => origin.move(new Vec2d(offset)))
        );
    });

    test('bottom right', () => {
        const origin = new Vec2d(maze.getSize().move(new Vec2d([-1, -1])));
        testPostions(
            origin,
            [
                [-1, 0],
                [0, -1]
            ].map(offset => origin.move(new Vec2d(offset)))
        );
    });

    test('bottom left', () => {
        const origin = new Vec2d([0, maze.getSize().y - 1]);
        testPostions(
            origin,
            [
                [1, 0],
                [0, -1]
            ].map(offset => origin.move(new Vec2d(offset)))
        );
    });

    test('center', () => {
        const origin = new Vec2d([2, 2]);
        testPostions(
            origin,
            [
                [-1, 0],
                [1, 0],
                [0, 1],
                [0, -1]
            ].map(offset => origin.move(new Vec2d(offset)))
        );
    });
});
