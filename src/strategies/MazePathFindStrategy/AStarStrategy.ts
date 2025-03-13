import { AssignNode } from 'three/src/nodes/Nodes';
import MazePathFinder from '../../maze/MazePathFinder';
import { MazePathFinderNode } from '../../maze/MazePathFinderNode';
import { Vec2d, MazePath } from '../../types';
import { MazePathFindStrategy } from './MazePathFindStrategy';
import { Sleep } from '../../utils/Sleep';

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

        /**
         * algorithm queue. It holds nodes to be processed
         */
        const sortedQueue: AStarNodeQueued[] = [];

        /**
         * Currently processed node.
         * If end was found lopp will break therefore currentNodePos will be end node postion.
         */
        let currentNodePos: Vec2d;

        /**
         * computes heuristic
         * @param param0 postion of node to compute heuristic for
         * @returns heuristic value
         */
        const computeHeuristic = (nodePos: Vec2d) => {
            // it compustes Taxicab distance
            return Math.abs(nodePos.x - end.x) + Math.abs(nodePos.y - end.y);
        };

        /**
         * @param array array
         * @param value value to find
         * @param isLess checks a < b
         * @returns number of index to insert at
         */
        const findIndexToInsertAt = (
            array: AStarNodeQueued[],
            value: AStarNodeQueued,
            isLess: (a: AStarNodeQueued, b: AStarNodeQueued) => boolean
        ): number => {
            let idx: number = 0;
            while (idx < array.length && isLess(array[idx], value)) ++idx;

            return idx;
        };

        const queueComparator = (a: AStarNodeQueued, b: AStarNodeQueued) => {
            const res = a.totalCost < b.totalCost;
            return res;
        };

        const getDistanceOfNodeFromStartNode = (nodePos: Vec2d) => {
            return state.get(JSON.stringify(nodePos)).distanceFromStart;
        };

        /**
         * @param nodePos position of node to compute total cost of
         * @returns number
         */
        const computeTotalCost = (nodePos: Vec2d): number => {
            return computeHeuristic(nodePos) + getDistanceOfNodeFromStartNode(nodePos);
        };

        /**
         * enqueues node to queue doing all state tracking along the way
         * @param param0 node and it's postion
         */
        const enqueue = ({ node, pos }: { node: T; pos: Vec2d }): void => {
            // current node processed is preveious of enqueued one
            const prevNodePos = currentNodePos;
            const previousNode = state.get(JSON.stringify(prevNodePos));

            // extract previous node distance from start
            const distanceToPreviousNodeFromStart = previousNode.distanceFromStart;

            // distance to current node is sum of:
            // - distance from start node to previous node
            // - distance from previous node to current node (1)
            const distanceToNodeFromStart = distanceToPreviousNodeFromStart + 1;

            // Save state of queued node
            state.set(JSON.stringify(pos), {
                distanceFromStart: distanceToNodeFromStart,
                cameToFrom: prevNodePos
            });

            const totalCost = computeTotalCost(pos);

            /// helper variable to store queuing node state
            const nodeQueued: AStarNodeQueued = {
                totalCost,
                nodePos: pos
            };

            // find index where to insert queuing node so that it remains sorted
            const indexToAdd: number = findIndexToInsertAt(
                sortedQueue,
                nodeQueued,
                queueComparator
            );

            // insert to queue
            sortedQueue.splice(indexToAdd, 0, nodeQueued);
            // mark node as queued
            node.makeQueued();
        };

        // add state of start node, it has 0 distance from start as it's start node
        state.set(JSON.stringify(start), { distanceFromStart: 0, cameToFrom: start });
        // add start node to queue
        sortedQueue.push({ totalCost: computeHeuristic(start), nodePos: start });
        maze.getNode(start).makeQueued();

        // while queue is not empty
        while (sortedQueue.length !== 0) {
            // get node pos
            currentNodePos = sortedQueue.shift().nodePos;

            const currentNode = maze.getNode(currentNodePos);
            currentNode.makeCandidate();

            // break loop if found end node
            if (currentNodePos.equals(end)) {
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
                    // enqueue adjacent nodes
                    enqueue({ node, pos });
                });
        }

        /**
         * Path to end from start node
         */
        const path: MazePath = [];

        // TODO rebuildpath
        if (currentNodePos.equals(end)) {
            // while not backtracked to start node
            while (currentNodePos.equals(start)) {
                // get current node
                const currentNode = maze.getNode(currentNodePos);
                // mark it as selected
                currentNode.makeSelected();
                // add it to path
                path.push(currentNodePos);

                // go back to previous node
                currentNodePos = state.get(JSON.stringify(currentNodePos)).cameToFrom;
            }
            // make start node selected
            maze.getNode(currentNodePos).makeSelected();
        }

        // revert backtracked path
        path.reverse();

        return path;
    }
}
