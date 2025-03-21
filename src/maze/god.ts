import { GenerationStrategy } from '../strategies/generation/GenerationStrategy';
import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { Vec2d } from '../types';
import { Random } from '../utils/Random';
import MazePathFinder from './MazePathFinder';
import { MazePathFinderNode } from './MazePathFinderNode';

export class MazeFacade {
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
        return this.getMazePathFinder();
    }

    setPathFinderStrategy(strategy: MazePathFindStrategy<MazePathFinderNode>) {
        this.m_mazePathFinderStrategy = strategy;
    }

    getRandomNonCollidingNodePositon() {
        const nonColliding: Vec2d[] = [];

        this.m_mazePathFinder.forEachNode(({ pos, node }) => {
            if (!node.isColliding()) {
                nonColliding.push(pos);
            }
        });

        const randomNonCollidingNodeIndex = nonColliding[Random.randomIndex(nonColliding)];
        return randomNonCollidingNodeIndex;
    }

    randomizeStartEndPositions = (): { start: Vec2d; end: Vec2d } => {
        const start = this.getRandomNonCollidingNodePositon();

        let end: Vec2d;
        do {
            end = this.getRandomNonCollidingNodePositon();
        } while (start.equals(end));

        return {
            start,
            end
        };
    };

    getMazePathFinder() {
        return this.m_mazePathFinder;
    }
}
