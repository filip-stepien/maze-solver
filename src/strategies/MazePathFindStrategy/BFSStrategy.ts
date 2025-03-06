import MazePathFinder, { MazePathFinderNode } from '../../maze/MazePathFinder';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';

/**
 * TODO implement
 */
export class BFSStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        const startNode = maze.getNode(start);
        console.debug(startNode);
        // throw new Error('Method not implemented.');
        return [];
    }
}
