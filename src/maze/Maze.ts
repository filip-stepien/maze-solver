import { Vec2d } from '../types';
import { logFunctionCall } from './Debug';

export class MazeNode {
    public static initializer = new this();

    private m_isSolid: boolean = false;

    makeSolid(): void {
        this.m_isSolid = true;
    }

    makeNotSolid(): void {
        this.m_isSolid = false;
    }

    isSolid(): boolean {
        return this.m_isSolid;
    }

    toString(): string {
        if (this.isSolid()) {
            return '▓';
        } else {
            return '·';
        }
    }

    clone() {
        const clone = structuredClone(this);
        return clone;
    }
}

export class Maze<T extends MazeNode> {
    protected m_matrix: T[][] = [[]];
    protected m_size: Vec2d = new Vec2d([0, 0]);

    getSize() {
        return this.m_size;
    }

    /**
     *
     * @param pos Postion to validate
     * @throws RangeError
     */
    protected validateNodePosition(pos: Vec2d) {
        const x = pos.x;
        const y = pos.y;
        if (
            // check x bound
            x < 0 ||
            x > this.m_size.x ||
            // check y bound
            y < 0 ||
            y > this.m_size.y
        ) {
            const mess = 'Postion ${pos.toString()} is out of bounds';
            throw RangeError(mess);
        }
    }

    private initMatrix({ x, y }: Vec2d, factory: () => T) {
        this.m_size = { x, y };
        this.m_matrix = Array.from({ length: this.m_size.y }, () => {
            return Array.from({ length: this.m_size.x }, () => {
                return factory();
            });
        });
    }

    /**
     * @param x size of maze in horizontal direction
     * @param y size of maze in vertical drection
     * @param nodeFactory factory to fill nodes in maze
     * @param
     * @returns Maze
     *
     * @brief
     * - If data is specified, all other parameters are ignored
     * - If it is not x, y and initializer are used
     */
    public constructor({
        size,
        solidityGenerator,
        nodeFactory
    }: {
        size?: Vec2d;
        nodeFactory: () => T;
        solidityGenerator?: boolean[][]; //YX
    }) {
        console.debug('Maze::Maze');

        if (size.x && size.y && !solidityGenerator) {
            console.debug('Maze::Maze intializing by size');
            this.initMatrix(size, nodeFactory);
            return;
        }
        if (!size.x && !size.y && solidityGenerator) {
            solidityGenerator.forEach(row => {
                row.forEach(e => {
                    console.log('x');
                });
            });
        }
    }

    /**
     *
     * @param x horizontal postion of node
     * @param y vertical postion of node
     * @returns node at given postion
     */
    protected getNode(pos: Vec2d): T {
        console.debug('Maze::getNode()', pos);
        this.validateNodePosition(pos);
        return this.m_matrix[pos.y][pos.x];
    }

    public toString(): string {
        let str = '';
        this.m_matrix.forEach(e => {
            e.forEach(node => {
                // console.debug(node);
                str += node.toString();
            });
            str += '\n';
        });
        return str;
    }

    /**
     * @param x horizontal postion of node
     * @param y vertical postion of node
     * @param transform lambda function that takes current state of node and returns modfied one
     */
    public transformNode(pos: Vec2d, transform: (node: T) => T): void {
        console.debug('Maze::transformNode');
        this.validateNodePosition(pos);
        const { x, y } = pos;
        const oldNode: T = this.m_matrix[y][x];

        const node: T = transform(oldNode);

        this.m_matrix[y][x] = node;
        // console.debug('transformed', node);
    }

    /**
     * perfroms transformation on all nodes
     * @param transform @see transformNode
     */
    public transformEachNode(transform: (node: T) => T): void {
        this.m_matrix.forEach(row => row.forEach(e => transform(e)));
    }
}
