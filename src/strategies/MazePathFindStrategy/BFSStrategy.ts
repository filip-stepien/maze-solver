import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';

/**
 * TODO implement
 */
export class BFSStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        console.debug(`${BFSStrategy.name}::findPath()`);

        return [];
    }
}
