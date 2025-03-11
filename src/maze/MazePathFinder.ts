import chalk from 'chalk';
import { MazePathFindStrategy } from '../strategies/MazePathFindStrategy/MazePathFindStrategy';
import { MazePath, Vec2d } from '../types';
import { Maze, MazeConstructorArgs } from './Maze';
import {
    MazePathFinderNode,
    MazePathFinderNodeLabel,
    MPFNodeLabelCallBackParams,
    MPFNodeLabelChangeCallback
} from './MazePathFinderNode';
import { call } from 'three/src/Three.TSL';

/**
 * adds position
 */
type MPFLabelChangeCallbackParams = MPFNodeLabelCallBackParams & { pos: Vec2d };

type MPFLabelChangeCallback = (args: MPFLabelChangeCallbackParams) => void;

/**
 * Extends Maze giving it pathfinding abilities
 */
export default class MazePathFinder<T extends MazePathFinderNode> extends Maze<T> {
    protected m_pathfindStrategy: MazePathFindStrategy<T>;

    private m_MPFLabelChangeObservers: MPFLabelChangeCallback[] = [];

    public constructor(args: MazeConstructorArgs<T>) {
        super(args);
        this.addNodeChangeHandlers();
    }

    /**
     * @param strategy pathfinder strategy to use
     */
    setPathFindStrategy(strategy: MazePathFindStrategy<T>): void {
        this.m_pathfindStrategy = strategy;
        this.resetNodeLabels();
    }

    /**
     * Finds path from start to end
     * @param start position of start
     * @param end position of end
     * @returns path
     *
     * @throws
     * - when *start* or *end* position is invalid
     * - when *start* or *end* is colliding
     */
    findPath(start: Vec2d, end: Vec2d): MazePath {
        if (!this.m_pathfindStrategy) {
            throw new Error('MazePathFinder::findPath strategy is not set');
        }

        this.validateNodePosition(start);
        this.validateNodePosition(end);
        if (this.getNode(start).isColliding() || this.getNode(end).isColliding()) {
            throw Error('Can not start/finish path in wall');
        }

        this.resetNodeLabels();

        this.getNode(start).makeStart();
        this.getNode(end).makeFinish();
        return this.m_pathfindStrategy.findPath(this, start, end);
    }

    public resetNodeLabels() {
        this.forEachNode(({ node }) => node.resetLabels());
    }

    /**
     *
     * @param callback function to call when any node in MazePathFinder changes
     */
    public addNodeLabelChangeObserver(callback: MPFLabelChangeCallback): void {
        this.m_MPFLabelChangeObservers.push(callback);
    }

    protected invokeNodeLabelChangeObservers(params: MPFLabelChangeCallbackParams) {
        this.m_MPFLabelChangeObservers.forEach(callback => {
            callback(params);
        });
    }

    /**
     * adds listenters to nodes so that can callBack and notify maze about change in node with additional information of position they are at
     */
    private addNodeChangeHandlers(): void {
        let changedNodePos: Vec2d;

        this.forEachNode(({ node: nodeObserved, pos: nodeObserverdPos }) => {
            const callback: MPFNodeLabelChangeCallback = ({ node, labelChanged }) => {
                const nodePos: Vec2d = nodeObserverdPos;

                this.invokeNodeLabelChangeObservers({ node, labelChanged, pos: nodePos });
            };

            nodeObserved.addLabelChangeObserver(callback);
        });
    }

    /**
     * @returns object containing label statistics
     */
    public getStats = () => {
        const countLabeled = (label: MazePathFinderNodeLabel) => {
            let counter = 0;
            this.forEachNode(({ node }) => {
                if (node.hasLabel(label)) {
                    ++counter;
                }
            });
            return counter;
        };

        const stats = {
            // How many times candidates are there
            candidated: countLabeled('candidate'),
            forsaken: countLabeled('forsaken'),
            queued: countLabeled('queued'),
            selected: countLabeled('selected')
        };
        return stats;
    };
}
