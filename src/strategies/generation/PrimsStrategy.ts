import { Vec2d } from '../../types';
import { Random } from '../../utils/Random';
import { GenerationStrategy } from './GenerationStrategy';

/**
 * TODO: adapt maze representation
 * for now 1 = wall, 0 = path
 */
export class PrimsStrategy implements GenerationStrategy {
    private getNeighbors(coords: Vec2d, cols: number, rows: number): Vec2d[] {
        const neighbors: Vec2d[] = [];
        const directions: Vec2d[] = [
            new Vec2d({ x: 2, y: 0 }),
            new Vec2d({ x: -2, y: 0 }),
            new Vec2d({ x: 0, y: 2 }),
            new Vec2d({ x: 0, y: -2 })
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

    public generateMaze(cols: number, rows: number) {
        const maze: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));
        const edges: { from: Vec2d; to: Vec2d }[] = [];

        const startNode: Vec2d = new Vec2d({
            x: Random.randomInt(0, cols - 1),
            y: Random.randomInt(0, rows - 1)
        });

        maze[startNode.y][startNode.x] = 0;

        // FIXME neczytleny kod
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
                const path: Vec2d = new Vec2d({
                    x: (from.x + to.x) / 2,
                    y: (from.y + to.y) / 2
                });

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

        return maze.map(row => row.map(e => e !== 0));
    }
}
