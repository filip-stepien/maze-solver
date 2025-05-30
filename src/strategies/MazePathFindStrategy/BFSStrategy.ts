import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode, MazePathFinderNodeLabel } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';

/**
 * Finds path using Breadth-first search
 */
export class BFSStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        const state: Map<string, { cameToFrom: Vec2d }> = new Map();

        const queue = [start];
        maze.getNode(start).makeQueued();

        let currentNodePos: Vec2d;
        do {
            currentNodePos = queue.shift();
            // console.log(currentNodePos);
            // console.debug('Current node', currentNodePos);
            const node = maze.getNode(currentNodePos);
            node.makeCandidate();

            // end if current node is finish node
            if (currentNodePos.equals(end)) {
                break;
            }

            maze.getAdjacentNodes(currentNodePos)
                // filter not needed things
                .filter(
                    ({ node, pos }) =>
                        // if node was already prcessed ignore it
                        !(
                            state.has(JSON.stringify(pos)) ||
                            // or is colliding
                            node.isColliding()
                        )
                )
                .forEach(({ node: adjacientNode, pos: adjacientNodePos }) => {
                    // save from where that node was reached
                    state.set(JSON.stringify(adjacientNodePos), {
                        cameToFrom: currentNodePos
                    });

                    // add it to queue
                    queue.push(adjacientNodePos);
                    adjacientNode.makeQueued();
                });
        } while (queue.length != 0);

        // if last processed node is end node
        if (currentNodePos.equals(end) && state.has(JSON.stringify(currentNodePos))) {
            const path: MazePath = [];
            // bactrack nodes till to start
            while (!currentNodePos.equals(start)) {
                // make current node selected
                maze.getNode(currentNodePos).makeSelected();

                // add current node to path
                path.push(currentNodePos);

                // find where is previous node
                const prevNodePos = state.get(JSON.stringify(currentNodePos)).cameToFrom;

                // make previous current
                currentNodePos = prevNodePos;
            }

            maze.getNode(currentNodePos).makeSelected();

            return path.reverse();
        }

        // if not found path
        return [];
    }
}
