import { AssignNode } from 'three/src/nodes/Nodes';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';

export class AStarStrategy<T extends MazePathFinderNode> implements MazePathFindStrategy<T> {
    findPath(maze: MazePathFinder<T>, start: Vec2d, end: Vec2d): MazePath {
        // algorithm state of node
        type AStarState = {
            distanceFromStart: number;
            cameToFrom: Vec2d;
        };

        // map of states by noedPos
        const state: Map<string, AStarState> = new Map();

        // queue of nodes
        type AStarNodeQueued = {
            // heuristic + distanceFromStart
            totalCost: number;
            // postion of node
            nodePos: Vec2d;
        };

        const computeHeuristic = ({ nodePos }: { nodePos: Vec2d }) => {
            return Math.sqrt(Math.abs(nodePos.x - end.x) + Math.abs(nodePos.y - end.y));
        };

        const sortedQueue: AStarNodeQueued[] = [];

        state.set(JSON.stringify(start), { distanceFromStart: 0, cameToFrom: start });
        sortedQueue.push({ totalCost: computeHeuristic({ nodePos: start }), nodePos: start });
        maze.getNode(start).makeQueued();

        let currentNodePos: Vec2d;

        /**
         *
         * @param array array
         * @param value value to find
         * @param compareFun compare two nodes returns negative if a < b, positive if a > b, 0 if a is equal to b
         * @returns
         */
        const binarySearch = (
            array: AStarNodeQueued[],
            value: AStarNodeQueued,
            compareFun: (a: AStarNodeQueued, b: AStarNodeQueued) => number
        ): number => {
            let leftBorder = 0;
            let rightBorder = array.length - 1;
            while (leftBorder <= rightBorder) {
                const middleSplit = (rightBorder + leftBorder) >> 1;
                const cmp = compareFun(value, array[middleSplit]);
                if (cmp > 0) {
                    leftBorder = middleSplit + 1;
                } else if (cmp < 0) {
                    rightBorder = middleSplit - 1;
                } else {
                    return middleSplit;
                }
            }
            return -leftBorder - 1;
        };

        const queueComparator = (a: AStarNodeQueued, b: AStarNodeQueued) => {
            return b.totalCost - a.totalCost;
        };

        const enqueue = ({ node, pos }: { node: T; pos: Vec2d }): void => {
            const prevNodePos = currentNodePos;
            const prevNodeState = state.get(JSON.stringify(prevNodePos));

            // this is distance from start to previous node + distance from previous node to current node (1)
            const distanceToCurrentNodeFromStart = prevNodeState.distanceFromStart + 1;

            // compute totalCost
            const totalCost =
                // heuristic + distance from start node
                computeHeuristic({ nodePos: pos });

            state.set(JSON.stringify(pos), {
                distanceFromStart: distanceToCurrentNodeFromStart,
                cameToFrom: prevNodePos
            });

            // TODO add to sortedQueue so that invariant is valid (lowest cost first)

            const indexToAdd: number = binarySearch(
                sortedQueue,
                { totalCost, nodePos: pos },
                queueComparator
            );

            sortedQueue.splice(indexToAdd, 0, {
                totalCost,
                nodePos: pos
            });
            node.makeQueued();
            console.log(sortedQueue);
        };

        // while queue is not empty
        while (sortedQueue.length !== 0) {
            // get node pos
            currentNodePos = sortedQueue.shift().nodePos;
            const currentNode = maze.getNode(currentNodePos);
            currentNode.makeCandidate();

            // break loop if found end node
            if (currentNodePos == end) {
                console.log('FOUND END');
                break;
            }

            maze.getAdjacentNodes(currentNodePos)
                // filter out colliding nodes
                .filter(data => {
                    return !data.node.isColliding();
                })
                // filter queued/visited already nodes
                .filter(data => {
                    const res = !state.has(JSON.stringify(data.pos));
                    return res;
                })
                .forEach(({ node, pos }) => {
                    // console.log('3', node);
                    // enque adjacent nodes
                    enqueue({ node, pos });
                });
        }

        // TODO rebuildpath

        // if not found path
        return [];
    }
}
