import { Vec2d } from '../types';
import { logFunctionCall } from './Debug';
import { MazeNode } from './MazeNode';

export class Maze<T extends MazeNode> {
    protected m_matrix: T[][] = [[]];
    protected m_size: Vec2d = new Vec2d([0, 0]);

    getSize() {
        return this.m_size;
    }

    /**
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
        collsionState,
        nodeFactory
    }: {
        size?: Vec2d;
        nodeFactory: () => T;
        collsionState?: boolean[][]; //YX
    }) {
        // console.debug('Maze::Maze');

        if (size?.x && size?.y && !collsionState) {
            // console.debug('Maze::Maze intializing by size');
            this.initMatrix(size, nodeFactory);
            return;
        }
        if (!size?.x && !size?.y && collsionState) {
            // read size
            size = new Vec2d({
                x: collsionState[0].length,
                y: collsionState.length
            });

            this.initMatrix(size, nodeFactory);

            for (let y = 0; y < this.m_size.y; ++y) {
                for (let x = 0; x < this.m_size.x; ++x) {
                    const node = this.getNode({ x, y });
                    if (collsionState[y][x] == true) {
                        node.makeColliding();
                    } else {
                        node.makeNotColliding();
                    }
                }
            }
        }
    }

    /**
     * @param x horizontal postion of node
     * @param y vertical postion of node
     * @returns node at given postion
     */
    public getNode(pos: Vec2d): T {
        // console.debug('Maze::getNode()', pos);
        this.validateNodePosition(pos);
        return this.m_matrix[pos.y][pos.x];
    }

    /**
     * perfrom operations on every node
     * @param callback
     */
    public forEachNode(callback: ({ pos, node }: { pos: Vec2d; node: T }) => void): void {
        for (let y = 0; y < this.m_size.y; ++y) {
            for (let x = 0; x < this.m_size.x; ++x) {
                const pos: Vec2d = { x, y };
                const node = this.getNode(pos);
                callback({ pos, node });
            }
        }
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
}
