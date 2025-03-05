import { Random } from '../utils/Random';
import { Vec2 } from '../types';
import { GenerationStrategy } from './GenerationStrategy';

/**
 * TODO: adapt maze representation
 * for now 1 = wall, 0 = path
 */
export class PrimsStrategy implements GenerationStrategy {
    private getNeighbors(coords: Vec2, cols: number, rows: number): Vec2[] {
        const neighbors: Vec2[] = [];
        const directions: Vec2[] = [
            { x: 2, y: 0 },
            { x: -2, y: 0 },
            { x: 0, y: 2 },
            { x: 0, y: -2 }
        ];

        for (const { x, y } of directions) {
            const neighborX = coords.x + x;
            const neighborY = coords.y + y;

            if (neighborX >= 0 && neighborX < cols && neighborY >= 0 && neighborY < rows) {
                neighbors.push({ x: neighborX, y: neighborY });
            }
        }

        return neighbors;
    }

    public generateMaze(cols: number, rows: number): void {
        const maze: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));
        const edges: { from: Vec2; to: Vec2 }[] = [];

        const startNode: Vec2 = {
            x: Random.randomInt(0, cols - 1),
            y: Random.randomInt(0, rows - 1)
        };

        maze[startNode.y][startNode.x] = 0;

        edges.push(
            ...this.getNeighbors(startNode, cols, rows).map(neighbor => ({
                from: startNode,
                to: neighbor
            }))
        );

        while (edges.length > 0) {
            const randomIndex = Random.randomIndex(edges);
            const { from, to } = edges.splice(randomIndex, 1)[0];

            if (maze[to.y][to.x] === 1) {
                const path: Vec2 = {
                    x: (from.x + to.x) / 2,
                    y: (from.y + to.y) / 2
                };

                maze[to.y][to.x] = 0;
                maze[path.y][path.x] = 0;

                edges.push(
                    ...this.getNeighbors(to, cols, rows).map(neighbor => ({
                        from: to,
                        to: neighbor
                    }))
                );
            }
        }

        //return maze;
        console.table(maze);
    }
}
