import { Maze } from './Maze';
import { MazeNode } from './MazeNode';
import { MazePathFinderNode } from './MazePathFinderNode';

export interface MazePathFinderExporter<T extends MazeNode> {
    doExport(maze: Maze<T>): string;
}
