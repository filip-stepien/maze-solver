import chalk, { colorNames, foregroundColorNames } from 'chalk';
import { MazeNode } from './MazeNode';
import { Color } from 'three';

/**
 * Node states
 * - candidate -- algorithm might use this node for finall path
 * - finish -- required end node of path
 * - queued -- node is queued and might become candiate
 * - selected -- algorithm has chosen node for finall path
 * - start -- required start node of path
 *
 * state flow
 * queued -> candiate -> selected
 */
type MazePathFinderNodeStateLabel = 'start' | 'finish' | 'candidate' | 'selected' | 'queued';

/**
 * On top of representing node,
 * it also represents it's "state" from pathfinding algirthm perspective.
 * pathfinding algorithm use this class methods to indicate state of node.
 */

export class MazePathFinderNode extends MazeNode {
    constructor() {
        super();
        this.m_labels = new Set([]);
    }

    private m_labels: Set<MazePathFinderNodeStateLabel> = new Set([]);

    /**
     * adds label to node
     * @param labels labels to add
     * @note duplicates are ignored
     */
    addLabels(labels: MazePathFinderNodeStateLabel[]) {
        // Add all elements from the 'labels' array to the 'm_labels' set
        labels.forEach(label => this.m_labels.add(label));
    }

    // NOTE might be not needed
    // removeLabels(label: MazePathFinderNodeStateLabel) {
    //     this.m_labels.delete(label);
    // }
    /**
     * Removes all labels from node
     */
    clearLabels() {
        this.m_labels.clear();
    }

    /**
     * @returns Set containg labels
     */
    getLabels() {
        return structuredClone(this.m_labels);
    }

    hasLabel(label: MazePathFinderNodeStateLabel): boolean {
        return this.m_labels.has(label);
    }

    protected getCharacter() {
        if (this.hasLabel('finish')) {
            return '';
        }
        if (this.hasLabel('start')) {
            return '';
        }
        if (this.hasLabel('selected')) {
            return '󰸞';
        }
        if (this.hasLabel('candidate')) {
            return '󰁁';
        }
        if (this.hasLabel('queued')) {
            return '󰒲';
        }
        return super.getCharacter();
    }

    toString(): string {
        let colorFunc = chalk.gray;
        if (this.hasLabel('finish')) {
            colorFunc = chalk.greenBright;
        } else if (this.hasLabel('start')) {
            colorFunc = chalk.redBright;
        } else if (this.hasLabel('selected')) {
            colorFunc = chalk.green;
        } else if (this.hasLabel('candidate')) {
            colorFunc = chalk.yellow;
        } else if (this.hasLabel('queued')) {
            colorFunc = chalk.grey;
        }

        return colorFunc(this.getCharacter());
    }
}
