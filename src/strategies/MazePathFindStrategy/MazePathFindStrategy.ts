import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';

export interface MazePathFindStrategy<T extends MazePathFinderNode> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath;
}
