import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy';
import { MazePath, Vec2d } from '../types';
import { Maze, MazeNode } from './Maze';

/**
 * Node states
 * - notproccesed -- algorithm did not touch that node
 * - candidate -- algorithm might use this node for finall path
 * - selected -- algorithm has chosen node for finall path
 */
type MazePathFinderNodeState = 'notproceesed' | 'candidate' | 'selected';

export class MazePathFinderNode extends MazeNode {
    static initializer: MazePathFinderNode = new this();

    constructor() {
        super(undefined);
    }

    state: MazePathFinderNodeState = 'notproceesed';

    /**
     * Indicates that node was considered by algorithm for finding path
     */
    private m_candidate: boolean = false;

    /**
     * Indicates that node was chosen for path by algorithm
     */
    private m_selected: boolean = false;

    /**
     * Inicate that this node is or was considered by algorithm
     */
    tagCandidate() {
        this.m_candidate = true;
    }

    /**
     * Inicate that this node is/was selected for final path by algorithm
     */
    tagSelected() {
        // can't select node that was not processed
        this.tagCandidate();
        this.m_selected = true;
    }

    /**
     * @returns current most important state of node
     */
    getState(): MazePathFinderNodeState {
        if (this.m_selected) {
            return 'selected';
        }
        if (this.m_candidate) {
            return 'candidate';
        }

        return 'notproceesed';
    }
}

export default class MazePathFinder<T extends MazePathFinderNode> extends Maze<T> {
    protected strategy: MazePathFindStrategy<T>;

    constructor(maze: Maze<MazeNode>, initializer: T) {
        const transformedMaze = maze.getNodeMatrix().map(row => {
            return row.map(e => {
                return Object.assign({}, initializer, e);
            });
        });
        super({ data: transformedMaze });
    }

    findPath(start: Vec2d, end: Vec2d): MazePath {
        if (!this.strategy) {
            throw new Error('MazePathFinder::findPath strategy is not set');
            return;
        }
        return this.strategy.findPath(this, start, end);
    }
}
