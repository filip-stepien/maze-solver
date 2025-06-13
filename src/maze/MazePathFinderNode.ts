import chalk, { colorNames, foregroundColorNames } from 'chalk';
import { CharacterData, MazeNode, MazeNodeLabel } from './MazeNode';

export type MPFNodeLabelCallBackParams = {
    node: MazePathFinderNode;
    labelChanged: MazePathFinderNodeLabel;
};

/**
 * Type of label change observer of MazePathFinderNode
 */
export type MPFNodeLabelChangeCallback = (args: MPFNodeLabelCallBackParams) => void;

/**
 * Valid labels of MazePathFinderNode
 *
 * @see MazePathFinderNode
 */
export type MazePathFinderNodeLabel =
    | MazeNodeLabel
    | 'start'
    | 'finish'
    | 'candidate'
    | 'forsaken'
    | 'selected'
    | 'queued';

/**
 * On top of representing node,
 * it also represents it's "state" from pathfinding algirthm perspective.
 * pathfinding algorithm use this class methods to indicate state of node.
 *
 * Node label changes are required to be done in *"Add higher priorty first, remove lower after"* order.
 * - eg. queued node becomes candidate. It should first recive candidate label and then have queued removed.
 *
 * Node states shown as labels and manipulated by make* methods,
 * when they can be used depends on label category and what label is see below
 *
 * - some labels are mutually exclusive
 * - some labels may have strict change order) as shonw below:
 *
 * ### Node role
 *
 * Regural nodes don't have any of those labels, those two labels are mututaly exclusive
 *
 * - finish -- end node of path
 * - start -- required start node of path
 * ```
 * none <--> start | finish
 * ```
 * ### Node state
 *
 * - queued -- node is queued and will become candidate (or algorithm stops before it does)
 * - candidate -- algorithm might use this node for final path
 * - selected -- algorithm has chosen node for final path
 * - forsaken -- algorithm consiedered node as candidate but doesn't anymore
 *
 * ```
 * none --> queued <--> candidate --> selected
 *                              _/
 *               forsaken <----/
 * ```
 */
export class MazePathFinderNode extends MazeNode {
    /**
     * nodeRole label categories
     *
     * it's only here beacause class instance can not access static members without explicitly stating classname
     */
    m_mazePathFinderNodeRoleLabels: MazePathFinderNodeLabel[] = ['start', 'finish'];

    m_mazePathFinderNodeStateLabels: MazePathFinderNodeLabel[] = [
        'queued',
        'candidate',
        'selected',
        'forsaken'
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

    makeForesaken() {
        this.promoteLabel('candidate', 'forsaken');
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
            throw new Error(`Can not protmote to ${newLabel}, without being ${oldLabel} first.`);
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
     * removes all labels from node.
     * Should be used when you don't care about them
     */
    resetLabels() {
        this.m_labels.clear();
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
    hasLabel(label: string): boolean {
        return this.m_labels.has(label as MazePathFinderNodeLabel);
    }

    /**
     * get label that is most important, used for drawing
     */
    public getDisplayedLabel() {
        const labelPriority: MazePathFinderNodeLabel[] = [
            'finish',
            'start',
            'selected',
            'candidate',
            'queued',
            'forsaken'
        ];

        for (const label of labelPriority) {
            if (this.hasLabel(label)) {
                return label;
            }
        }

        return super.getDisplayedLabel();
    }

    public getRepresentation(): CharacterData {
        const labelIcons = {
            finish: { fontAwesomeName: 'home', icon: '', color: 'blue' },
            start: { fontAwesomeName: 'user', icon: '', color: 'blue' },
            selected: { fontAwesomeName: 'check', icon: '󰸞', color: 'green' },
            candidate: { fontAwesomeName: 'arrows-alt', icon: '󰁁', color: 'orange' },
            queued: { fontAwesomeName: 'hourglass', icon: '󰞌', color: 'purple' },
            forsaken: { fontAwesomeName: 'skull', icon: '󰚌', color: 'red' }
        };

        for (const [label, data] of Object.entries(labelIcons)) {
            if (this.hasLabel(label)) {
                return data;
            }
        }

        return super.getRepresentation();
    }

    protected getChalkForegroundColorFunction() {
        const labelColorMap = new Map([
            ['purple', chalk.rgb(64, 64, 233)],
            ['green', chalk.green],
            ['blue', chalk.blue],
            ['yellow', chalk.yellow],
            ['red', chalk.red],
            ['white', chalk.white]
        ]);

        return labelColorMap.get(this.getRepresentation().color) || chalk.grey;
    }

    protected getChalkBackgroundColorFunction() {
        const labelBgMap = new Map([
            ['finish', chalk.bgWhite],
            ['start', chalk.bgWhite],
            ['selected', chalk.bgGreen]
        ]);

        return labelBgMap.get(this.getRepresentation().bgColor) || chalk.black;
    }

    toString(): string {
        const colorFunc = this.getChalkForegroundColorFunction();
        const bgFunc = this.getChalkBackgroundColorFunction();

        const rep: CharacterData = this.getRepresentation();

        return bgFunc(colorFunc(this.getRepresentation().icon));
    }
}
