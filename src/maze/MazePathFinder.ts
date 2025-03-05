import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy';
import { MazePath, Vec2d } from '../types';
import { Maze, MazeNode } from './Maze';

export class MazePathFinderNode extends MazeNode {
    /**
     * Indicates that node was considered by algorithm for finding path
     */
    private m_consdered: boolean;

    /**
     * Inicate that this node was considered by algorithm
     */
    tagConsidered() {
        this.m_consdered = true;
    }

    /**
     * Query weather node was considered
     */
    isConsidered(): boolean {
        return this.m_consdered;
    }

    /**
     * Indicates that node was chosen for path by algorithm
     */
    private m_selected: boolean;

    tagSelected() {
        this.m_selected = true;
    }

    isSelected() {
        return this.m_selected;
    }
}

export default class MazePathFinder<T extends MazePathFinderNode> extends Maze<T> {
    protected strategy: MazePathFindStrategy<T>;

    findPath(start: Vec2d, end: Vec2d): MazePath {
        if (!this.strategy) {
            throw new Error('MazePathFinder::findPath strategy is not set');
            return;
        }
        return this.strategy.findPath(this, start, end);
    }
}
