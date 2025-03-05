import { Vec2d } from '../types';
import { logFunctionCall } from './Debug';

export class MazeNode {
    private m_isSolid: boolean;

    constructor({ isSolid }: { isSolid: boolean }) {
        this.m_isSolid = isSolid;
    }

    setIsSolid(isSolid: boolean): void {
        console.debug('MazeNode::setIsSolid');
        this.m_isSolid = isSolid;
    }

    isSolid(): boolean {
        return this.m_isSolid;
    }
}

export class Maze<T extends MazeNode> {
    protected matrix: MazeNode[][];

    protected size: Vec2d;

    get getSize() {
        return this.size;
    }

    /**
     *
     * @param pos Postion to validate
     * @throws RangeError
     */
    private validateNodePosition(pos: Vec2d) {
        const x = pos.x;
        const y = pos.y;
        if (
            // check x bound
            x < 0 ||
            x > this.size.x ||
            // check y bound
            y < 0 ||
            y > this.size.y
        ) {
            const mess = 'Postion ${pos.toString()} is out of bounds';
            throw RangeError(mess);
        }
    }

    /**
     * @param x size of maze in horizontal direction
     * @param y size of maze in vertical drection
     * @param initializer value used to initialzie maze cells
     * @param data maze matrix to initialze with
     * @returns Maze
     *
     * @brief
     * - If data is specified, all other parameters are ignored
     * - If it is not x, y and initializer are used
     */
    public constructor({
        size,
        initializer,
        data
    }: {
        size?: Vec2d;
        initializer?: T;
        data?: T[][];
    }) {
        console.debug('Maze::Maze');
        if (data) {
            console.debug('Maze::Maze intializing with data matrix');
            this.matrix = data;
            return;
        }

        if (size.x && size.y && initializer) {
            console.debug('Maze::Maze intializing with template object');
            const { x, y } = size;
            this.size = size;
            this.matrix = Array.from(
                // create vector
                { length: y },
                // cosisting of vectors
                () =>
                    Array.from(
                        { length: x },
                        // with value of initalizer
                        () => {
                            return Object.assign(
                                Object.create(Object.getPrototypeOf(initializer)),
                                initializer
                            );
                        }
                    )
            );
            return;
        }

        throw Error('Invalid maze intialization');
    }

    /**
     *
     * @param x horizontal postion of node
     * @param y vertical postion of node
     * @returns node at given postion
     */
    public getNode(pos: Vec2d): MazeNode {
        return this.matrix[pos.x][pos.y];
    }

    public toString(): string {
        let str = '';
        this.matrix.forEach(e => {
            e.forEach(node => {
                // console.debug(node);
                str += node.isSolid() ? '▓' : '~';
            });
            str += '\n';
        });
        return str;
    }

    /**
     *
     * @param x horizontal postion of node
     * @param y vertical postion of node
     * @param transform lambda function that takes current state of node and returns modfied one
     */
    public transformNode(pos: Vec2d, transform: (node: MazeNode) => MazeNode): void {
        console.debug('Maze::transformNode');
        this.validateNodePosition(pos);
        const { x, y } = pos;
        const oldNode: MazeNode = this.matrix[y][x];

        const node: MazeNode = transform(oldNode);

        this.matrix[y][x] = node;
        // console.debug('transformed', node);
    }
}
