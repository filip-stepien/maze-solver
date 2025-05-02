import { vec2 } from 'three/src/Three.TSL';
import { Maze } from '../../maze/Maze';
import { MazeNode } from '../../maze/MazeNode';
import { Vec2d } from '../../types';
import { Random } from '../../utils/Random';
import { GenerationStrategy } from './GenerationStrategy';

export class DFSGenerationStategy implements GenerationStrategy {
    public generateMaze(cols: number, rows: number): boolean[][] {
        const maze = new Maze({
            size: new Vec2d([rows, cols]),
            nodeFactory: () => {
                return (() => {
                    const node = new MazeNode();
                    node.makeColliding();
                    return node;
                })();
            }
        });

        const startNode = new Vec2d([Random.randomInt(0, rows - 1), Random.randomInt(0, cols - 1)]);

        const visitedSet = new Set<string>();

        const moves = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ].map(e => new Vec2d(e));

        const dfs = (pos: Vec2d) => {
            if (visitedSet.has(JSON.stringify(pos))) {
                return;
            }
            visitedSet.add(JSON.stringify(pos));
            maze.getNode(pos).makeNotColliding();

            Random.shuffle(moves);
            moves.forEach(moveDir => {
                const middleNode = pos.move(moveDir);
                const toNode = middleNode.move(moveDir);
                try {
                    maze.validateNodePosition(middleNode);
                    maze.validateNodePosition(toNode);
                } catch (err) {
                    return;
                }
                if (visitedSet.has(JSON.stringify(toNode))) {
                    return;
                }
                maze.getNode(middleNode).makeNotColliding();
                maze.getNode(toNode).makeNotColliding();
                dfs(toNode);
            });
        };

        dfs(startNode);

        // make x to be x not y
        maze.transpose();

        return maze.getCollsionState();
    }
}
