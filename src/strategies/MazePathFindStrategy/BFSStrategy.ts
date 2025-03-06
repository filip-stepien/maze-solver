import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';

/**
 * TODO implement
 */
export class BFSStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    private logVisialzation = true;

    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        console.debug(`${BFSStrategy.name}::findPath()`);

        const state: Map<string, { cameToFrom: Vec2d }> = new Map();

        const queue = [start];

        let currentNodePos: Vec2d;
        do {
            currentNodePos = queue.shift();
            // console.log(currentNodePos);
            // console.debug('Current node', currentNodePos);
            maze.getNode(currentNodePos).addLabels(['candidate']);

            // end if current node is finish node
            if (JSON.stringify(currentNodePos) === JSON.stringify(end)) {
                break;
            }

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
                    queue.push(adjacientNodePos);
                    adjacientNode.addLabels(['queued']);
                }
            );

            // NOTE this draws as algorithm goes
            if (this.logVisialzation) {
                console.log('_____________\n' + maze.toString());
            }
        } while (queue.length != 0);

        // if last processed node is end node
        if (state.has(JSON.stringify(currentNodePos))) {
            const path: MazePath = [];
            path.push(currentNodePos);
            while (JSON.stringify(currentNodePos) !== JSON.stringify(start)) {
                const prevNodePos = state.get(JSON.stringify(currentNodePos)).cameToFrom;
                currentNodePos = prevNodePos;
                path.push(currentNodePos);
                maze.getNode(currentNodePos).addLabels(['selected']);

                // NOTE this draws as algorithm goes
                if (this.logVisialzation) {
                    console.log('_____________\n' + maze.toString());
                }
            }
            return path.reverse();
        }

        // if not found path
        return [];
    }
}
