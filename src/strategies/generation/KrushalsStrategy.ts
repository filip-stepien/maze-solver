import { array } from 'three/src/Three.TSL';
import { Random } from '../../utils/Random';
import { GenerationStrategy } from './GenerationStrategy';
import { Vec2d } from '../../types';
import { Maze } from '../../maze/Maze';
import { MazeNode } from '../../maze/MazeNode';

class DisjointSet {
    parent: number[];

    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, i) => i);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false;
        this.parent[rootY] = rootX;
        return true;
    }
}

export class KruskalsStrategy implements GenerationStrategy {
    private getNeighbors(coords: Vec2d, cols: number, rows: number): Vec2d[] {
        const neighbors: Vec2d[] = [];
        const directions: Vec2d[] = [
            new Vec2d({ x: 2, y: 0 }),
            // new Vec2d({ x: -2, y: 0 }),
            new Vec2d({ x: 0, y: 2 })
            // new Vec2d({ x: 0, y: -2 })
        ];

        for (const { x, y } of directions) {
            const neighborX = coords.x + x;
            const neighborY = coords.y + y;

            if (neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows) {
                neighbors.push(new Vec2d({ x: neighborX, y: neighborY }));
            }
        }

        return neighbors;
    }

    generateMaze(cols: number, rows: number): boolean[][] {
        // const maze: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
        const maze = new Maze({
            size: new Vec2d([rows, cols]),
            nodeFactory: () => {
                return new MazeNode();
            }
        });

        maze.forEachNode(e => {
            e.node.makeNotColliding();
        });

        const walls: Vec2d[] = [];

        maze.forEachNode(e => {
            walls.push(e.pos);
        });

        Random.shuffle(walls);

        const dt = new DisjointSet(cols * rows);

        const toIdx = (pos: Vec2d) => {
            return pos.y * rows + pos.x;
        };

        walls.forEach(wall => {
            const devidedNodes = maze.getAdjacentNodes(wall);
            // console.log(`${JSON.stringify(wall)} devides ${JSON.stringify(devidedNodes)}}`);

            const setsDevidedByWall = new Set();
            devidedNodes.forEach(e => {
                setsDevidedByWall.add(dt.find(toIdx(e.pos)));
            });
            // if all neiberhoods are distinct
            if (setsDevidedByWall.size === devidedNodes.length) {
                // make this passage
                maze.getNode(wall).makeColliding();
                devidedNodes.forEach(e => {
                    dt.union(toIdx(e.pos), toIdx(devidedNodes[0].pos));
                });
                // console.log(maze.toString());
            }
        });

        // make x to be x not y
        maze.transpose();
        return maze.getCollsionState();
    }
}
