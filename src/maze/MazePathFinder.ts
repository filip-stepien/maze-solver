import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { MazePath, Vec2d } from '../types';
import { Maze, MazeNode } from './Maze';

/**
 * Node states
 * - candidate -- algorithm might use this node for finall path
 * - selected -- algorithm has chosen node for finall path
 */
type MazePathFinderNodeStateLabel = 'candidate' | 'selected';

/**
 * On top of representing node,
 * it also represents it's "state" from pathfinding algirthm perspective.
 * pathfinding algorithm use this class methods to indicate state of node.
 */
export class MazePathFinderNode extends MazeNode {
    static s_initializer: MazePathFinderNode = new this();

    constructor() {
        super(undefined);
    }

    private m_labels: Set<MazePathFinderNodeStateLabel> = Object.seal(new Set([]));

    /**
     * adds label to node
     * @param labels labels to add
     * @note duplicates are ignored
     */
    addLabels(labels: MazePathFinderNodeStateLabel[]) {
        // Add all elements from the 'labels' array to the 'm_labels' set
        labels.forEach(label => this.m_labels.add(label));
    }

    // NOTE might be not needed
    // removeLabels(label: MazePathFinderNodeStateLabel) {
    //     this.m_labels.delete(label);
    // }

    /**
     * Removes all labels from node
     */
    clearLabels() {
        this.m_labels.clear();
    }

    /**
     * @returns Set containg labels
     */
    getLabels() {
        return structuredClone(this.m_labels);
    }

    hasLabel(label: MazePathFinderNodeStateLabel): boolean {
        return this.m_labels.has(label);
    }
}

/**
 *
 */
export default class MazePathFinder<T extends MazePathFinderNode> extends Maze<T> {
    protected m_pathfindStrategy: MazePathFindStrategy<T>;

    constructor(maze: Maze<MazeNode>, initializer: T) {
        const transformedMaze = maze.getNodeMatrix().map(row => {
            return row.map(e => {
                const obj = Object.assign({}, initializer, e);
                return Object.seal(obj);
            });
        });
        super({ data: transformedMaze });
    }

    setPathFindStrategy(strategy: MazePathFindStrategy<T>): void {
        this.m_pathfindStrategy = strategy;
    }

    findPath(start: Vec2d, end: Vec2d): MazePath {
        console.debug('MazePathFinder::findPath()');
        this.validateNodePosition(start);
        this.validateNodePosition(end);
        if (!this.m_pathfindStrategy) {
            throw new Error('MazePathFinder::findPath strategy is not set');
        }
        return this.m_pathfindStrategy.findPath(this, start, end);
    }
}
