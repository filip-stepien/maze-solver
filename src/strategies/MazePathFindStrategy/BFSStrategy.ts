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

        const state: Map<string, { cameToFrom: Vec2d }> = new Map();

        let queue = [start];

        while (queue.length != 0) {
            const currentNodePos = queue.shift();
            // console.log(currentNodePos);
            // console.debug('Current node', currentNodePos);
            maze.getNode(currentNodePos).addLabels(['candidate']);

            maze.getAdjacentNodes(currentNodePos).forEach(
                ({ node: adjacientNode, pos: adjacientNodePos }) => {
                    // console.debug('processing adjacient ', adjacientNodePos);
                    if (
                        // if node was already prcessed ignore it
                        state.has(JSON.stringify(adjacientNodePos)) ||
                        // or is colliding
                        adjacientNode.isColliding()
                    ) {
                        return;
                    }

                    // save from where that node was reached
                    state.set(JSON.stringify(adjacientNodePos), {
                        cameToFrom: currentNodePos
                    });

                    // add it to queue
                    queue = queue.concat(adjacientNodePos);
                    adjacientNode.addLabels(['queued']);
                }
            );
            console.log('_____________\n' + maze.toString());
        }

        console.debug(`${BFSStrategy.name}::findPath() done`);
        return [];
    }
}
