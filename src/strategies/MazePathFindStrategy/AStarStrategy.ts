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

        const enqueue = ({ node, pos }: { node: T; pos: Vec2d }): void => {
            const prevNodePos = currentNodePos;
            const prevNodeState = state.get(JSON.stringify(prevNodePos));

            // this is distance from start to previous node + distance from previous node to current node (1)
            const distanceToCurrentNodeFromStart = prevNodeState.distanceFromStart + 1;

            // compute totalCost
            const totalCost =
                // heuristic + distance from start node
                computeHeuristic({ nodePos: pos }) + distanceToCurrentNodeFromStart;

            state.set(JSON.stringify(pos), {
                distanceFromStart: distanceToCurrentNodeFromStart,
                cameToFrom: prevNodePos
            });

            // TODO add to sortedQueue so that invariant is valid (lowest cost first)
        };

        // while queue is not empty
        while (sortedQueue.length !== 0) {
            // get node pos
            currentNodePos = sortedQueue.shift().nodePos;
            const currentNode = maze.getNode(currentNodePos);
            currentNode.makeCandidate();

            maze.getAdjacentNodes(currentNodePos)
                // filter out colliding nodes
                .filter(data => {
                    return !data.node.isColliding();
                })
                // filter queued/visited already nodes
                .filter(data => {
                    state.has(JSON.stringify(data.pos));
                })
                .forEach(({ node, pos }) => {
                    // TODO break loop if found end node

                    // enque adjacent nodes
                    enqueue({ node, pos });
                });
        }

        // TODO rebuildpath

        // if not found path
        return [];
    }
}
