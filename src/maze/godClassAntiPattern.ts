import { GenerationStrategy } from '../strategies/GenerationStrategy';
import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { Vec2d } from '../types';
import { Random } from '../utils/Random';
import MazePathFinder from './MazePathFinder';
import { MazePathFinderNode } from './MazePathFinderNode';

export class GodClassAntiPattern {
    protected m_mazePathFinder: MazePathFinder<MazePathFinderNode> = undefined;
    protected m_mazeGenerator: GenerationStrategy = undefined;
    protected m_mazePathFinderStrategy: MazePathFindStrategy<MazePathFinderNode> = undefined;

    setGeneratorStrategy(generator: GenerationStrategy) {
        this.m_mazeGenerator = generator;
    }

    generateMaze(size: Vec2d) {
        const colState = this.m_mazeGenerator.generateMaze(size.x, size.y);
        this.m_mazePathFinder = new MazePathFinder<MazePathFinderNode>({
            collsionState: colState,
            nodeFactory: () => {
                return new MazePathFinderNode();
            }
        });
    }

    setPathFinderStrategy(strategy: MazePathFindStrategy<MazePathFinderNode>) {
        this.m_mazePathFinderStrategy = strategy;
    }

    randomizeStartEndPositions = (): { start: Vec2d; end: Vec2d } => {
        const nonColliding: Vec2d[] = [];

        this.m_mazePathFinder.forEachNode(({ pos, node }) => {
            if (!node.isColliding()) {
                nonColliding.push(pos);
            }
        });

        const start = nonColliding[Random.randomIndex(nonColliding)];

        let end: Vec2d;
        do {
            end = nonColliding[Random.randomIndex(nonColliding)];
        } while (JSON.stringify(start) === JSON.stringify(end));

        return {
            start,
            end
        };
    };

    getMazePathFinderImplementationDetailGetterAntiPattern() {
        return this.m_mazePathFinder;
    }
}
