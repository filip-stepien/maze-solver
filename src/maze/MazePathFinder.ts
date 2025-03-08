import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { MazePath, Vec2d } from '../types';
import { Maze } from './Maze';
import { MazePathFinderNode } from './MazePathFinderNode';

/**
 *
 */
export default class MazePathFinder<T extends MazePathFinderNode> extends Maze<T> {
    protected m_pathfindStrategy: MazePathFindStrategy<T>;

    setPathFindStrategy(strategy: MazePathFindStrategy<T>): void {
        this.m_pathfindStrategy = strategy;
    }

    findPath(start: Vec2d, end: Vec2d): MazePath {
        console.debug('MazePathFinder::findPath()');
        if (!this.m_pathfindStrategy) {
            throw new Error('MazePathFinder::findPath strategy is not set');
        }

        this.validateNodePosition(start);
        this.validateNodePosition(end);
        if (this.getNode(start).isColliding() || this.getNode(end).isColliding()) {
            throw Error('Can not start/finish path in wall');
        }

        this.getNode(start).makeStart();
        this.getNode(end).makeFinish();
        return this.m_pathfindStrategy.findPath(this, start, end);
    }
}
