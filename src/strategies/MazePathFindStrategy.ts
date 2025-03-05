import MazePathFinder, { MazePathFinderNode } from '../maze/MazePathFinder';
import { Vec2d, MazePath } from '../types';

export interface MazePathFindStrategy<T extends MazePathFinderNode> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath;
}
