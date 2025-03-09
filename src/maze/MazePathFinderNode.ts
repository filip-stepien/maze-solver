import chalk, { colorNames, foregroundColorNames } from 'chalk';
import { MazeNode } from './MazeNode';
import { Color } from 'three';
import { error } from 'console';

/**
 * Valid labels of MazePathFinderNode
 */
export type MazePathFinderNodeLabel = 'start' | 'finish' | 'candidate' | 'selected' | 'queued';

type MPFNodeLabelChangeCallback = ({
    node,
    labelChanged
}: {
    node: MazePathFinderNode;
    labelChanged: MazePathFinderNodeLabel;
}) => void;

/**
 * On top of representing node,
 * it also represents it's "state" from pathfinding algirthm perspective.
 * pathfinding algorithm use this class methods to indicate state of node.
 *
 * Node label changes are required to be done in *"Add higher priorty first, remove lower after"* order.
 * - eg. queued node becomes candidate. It should first recive candidate label and then have queued removed.
 *
 * Node states shown as labels and manipulated by make* methods, some of labels are mutually exclusive
 * (and have strict change order) as shonw below:
 *
 * ### Node role
 *
 * Regural nodes don't have any of those labels, those two labels are mututaly exclusive
 *
 * - finish -- end node of path
 * - start -- required start node of path
 *
 * ### Node state
 *
 * - queued -- node is queued and will become candidate (or algorithm stops before it does)
 * - candidate -- algorithm might use this node for final path
 * - selected -- algorithm has chosen node for final path
 *
 */
export class MazePathFinderNode extends MazeNode {
    /**
     * nodeRole labels
     *
     * it's only here beacause class instance can not access static members without explicitly stating classname
     */
    m_mazePathFinderNodeRoleLabels: MazePathFinderNodeLabel[] = ['start', 'finish'];

    m_mazePathFinderNodeStateLabels: MazePathFinderNodeLabel[] = [
        'queued',
        'candidate',
        'selected'
    ];

    private m_labels: Set<MazePathFinderNodeLabel> = new Set([]);
    private m_MPFNodeLabelChangeObserver: MPFNodeLabelChangeCallback[] = [];

    constructor() {
        super();
        this.m_labels = new Set([]);
    }

    addLabelChangeObserver(observer: MPFNodeLabelChangeCallback) {
        this.m_MPFNodeLabelChangeObserver.push(observer);
    }

    protected invokeLabelChangeObservers(label: MazePathFinderNodeLabel) {
        this.m_MPFNodeLabelChangeObserver.forEach(listener => {
            listener({ node: this, labelChanged: label });
        });
    }

    /**
     * Labels node as finish node
     */
    makeFinish() {
        this.deleteLabels(['start']);
        this.addLabels(['finish']);
    }

    /**
     * Labels node as start node
     */
    makeStart() {
        this.deleteLabels(['finish']);
        this.addLabels(['start']);
    }

    makeRegural() {
        this.deleteLabels(this.m_mazePathFinderNodeRoleLabels);
    }

    makeQueued() {
        this.addLabels(['queued']);
    }

    makeCandidate() {
        this.promoteLabel('queued', 'candidate');
    }

    makeSelected() {
        this.promoteLabel('candidate', 'selected');
    }

    /**
     *
     * @param oldLabel label to remove, node **has to** have that label
     * @param newLabel label to promote to
     *
     * @throws When node doesn't have oldLabel
     */
    protected promoteLabel(oldLabel: MazePathFinderNodeLabel, newLabel: MazePathFinderNodeLabel) {
        if (!this.hasLabel(oldLabel)) {
            throw new Error(`Can not protmote to ${newLabel}, without being ${oldLabel} first`);
        }
        this.addLabels([newLabel]);
        this.deleteLabels([oldLabel]);
    }

    /**
     * adds label to node
     * @param labels labels to add
     * @note duplicates are ignored
     */
    protected addLabels(labels: MazePathFinderNodeLabel[]) {
        // Add all elements from the 'labels' array to the 'm_labels' set
        labels.forEach(label => {
            this.m_labels.add(label);
            this.invokeLabelChangeObservers(label);
        });
    }

    /**
     * removes labels from node
     * @param labels labels to remove
     */
    protected deleteLabels(labels: MazePathFinderNodeLabel[]) {
        // Add all elements from the 'labels' array to the 'm_labels' set
        labels.forEach(label => {
            if (this.m_labels.delete(label)) {
                this.invokeLabelChangeObservers(label);
            }
        });
    }

    /**
     * Get set of labels that node has
     * @returns Set containg labels
     * @see hasLabel
     *
     * returns clone
     */
    getLabels() {
        return structuredClone(this.m_labels);
    }

    /**
     * check weather node has label
     * @param label
     * @returns true / false
     * @see getLabels
     */
    hasLabel(label: MazePathFinderNodeLabel): boolean {
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
            colorFunc = chalk.magenta;
        }

        return colorFunc(this.getCharacter());
    }
}
