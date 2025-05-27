import { array, element } from 'three/src/Three.TSL';
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
    verbose: boolean = false;

    enableVerboseLogs() {
        this.verbose = true;
    }

    disableVerboseLogs() {
        this.verbose = true;
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

        const mazeNodes: Vec2d[] = [];

        maze.forEachNode(e => {
            mazeNodes.push(e.pos);
        });

        Random.shuffle(mazeNodes);

        const dt = new DisjointSet(cols * rows);

        const toIdx = (pos: Vec2d) => {
            return pos.y * rows + pos.x;
        };

        mazeNodes.forEach(currentMazeNode => {
            const adjacentNodesOfCurrentNode = maze.getAdjacentNodes(currentMazeNode);

            const setsNeiberhoringCurrentNode = new Set<number>();
            adjacentNodesOfCurrentNode.forEach(adjacentNode => {
                const adjacentNodeSetNumber = dt.find(toIdx(adjacentNode.pos));
                setsNeiberhoringCurrentNode.add(adjacentNodeSetNumber);
            });

            if (this.verbose) {
                console.log(
                    `node ${JSON.stringify(currentMazeNode)} is neighbors with ${
                        adjacentNodesOfCurrentNode.length
                    } nodes from ${setsNeiberhoringCurrentNode.size} sets ${JSON.stringify(
                        Array.from(setsNeiberhoringCurrentNode)
                    )}`
                );
            }

            // if all neiberhoods are from distinct sets
            if (setsNeiberhoringCurrentNode.size === adjacentNodesOfCurrentNode.length) {
                // make current node wall (colliding)
                maze.getNode(currentMazeNode).makeColliding();

                // union all nodes devided by that node to one set
                adjacentNodesOfCurrentNode.forEach(adjacentNode => {
                    const setsToUnion = [
                        toIdx(adjacentNode.pos),
                        toIdx(adjacentNodesOfCurrentNode[0].pos)
                    ];
                    if (this.verbose) {
                        console.log(`doing union of sets ${setsToUnion}`);
                    }
                    dt.union(setsToUnion[0], setsToUnion[1]);
                });

                if (this.verbose) {
                    console.log(maze.toString());
                }
            }
        });

        // make x to be x not y
        maze.transpose();
        return maze.getCollsionState();
    }
}
