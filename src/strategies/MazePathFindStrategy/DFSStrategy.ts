import { cameraFar } from 'three/src/Three.TSL';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';
import { node } from 'globals';

/**
 * Finds path using Depth-first search
 */
export class DFSStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    private logVisialzation = true;

    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        const state: Map<string, { visitedAlready: boolean }> = new Map();

        maze.getNode(start).makeQueued();
        const stack: Vec2d[] = [start];

        const dfs = (currentNodePos: Vec2d) => {
            const currentNode = maze.getNode(currentNodePos);
            currentNode.makeCandidate();

            // if current node is finsh node
            if (currentNode.hasLabel('finish')) {
                currentNode.makeSelected();
                return [currentNodePos];
            }

            for (const { node, pos } of maze
                .getAdjacentNodes(currentNodePos)
                .filter(e => !e.node.isColliding())) {
                // do not circle to visited already nodes
                if (node.hasLabel('candidate') || node.hasLabel('forsaken')) {
                    continue;
                }
                // Mark the adjacent node as queued
                node.makeQueued();

                // Recurse into the adjacent node
                const path: MazePath = dfs(pos);
                // Only return non-empty paths that do not lead to the finish node
                if (path.length !== 0) {
                    // If path is found, append current node to the path
                    currentNode.makeSelected();
                    path.push(currentNodePos);
                    return path; // Return the path found
                }

                // this node doesn't lead to end so reject it
                node.makeForesaken();
            }
            return [];
        };

        const path = dfs(start).reverse();

        // if not found path
        return path;
    }
}
