import { Vec2d } from '../types';
import { logFunctionCall } from './Debug';
import { MazeNode } from './MazeNode';

export type MazeConstructorArgs<T> = {
    size?: Vec2d;
    nodeFactory: () => T;
    collsionState?: boolean[][]; //YX
};

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
            x >= this.m_size.x ||
            // check y bound
            y < 0 ||
            y >= this.m_size.y
        ) {
            const mess =
                'Postion ' +
                JSON.stringify(pos) +
                ' is out of bounds, size is ' +
                JSON.stringify(this.getSize());

            throw RangeError(mess);
        }
    }

    private initMatrix({ x, y }: Vec2d, factory: () => T) {
        this.m_size = new Vec2d({ x, y });
        this.m_matrix = Array.from({ length: this.m_size.y }, () => {
            return Array.from({ length: this.m_size.x }, () => {
                return factory();
            });
        });
    }

    /**
     * @param size size of maze
     * @param nodeFactory factory to fill nodes in maze, it has to return node in any valid state
     * @param collsionState optional matrix indicating which nodes should be colliding
     * @returns Maze
     *
     * @warn collsionState and size are mutualy exclusive
     *
     */
    public constructor({ size, collsionState, nodeFactory }: MazeConstructorArgs<T>) {
        // console.debug('Maze::Maze');

        if (size != undefined && collsionState != undefined) {
            throw Error('size and collsionState are mutually exclusive');
        }

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

            this.forEachNode(({ pos, node }) => {
                if (collsionState[pos.y][pos.x] == true) {
                    node.makeColliding();
                } else if (collsionState[pos.y][pos.x] == false) {
                    node.makeNotColliding();
                }
            });
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
     * @param callback that takes postion and node
     */
    public forEachNode(callback: ({ pos, node }: { pos: Vec2d; node: T }) => void): void {
        for (let y = 0; y < this.m_size.y; ++y) {
            for (let x = 0; x < this.m_size.x; ++x) {
                const pos = new Vec2d({ x, y });
                const node = this.getNode(pos);
                callback({ pos, node });
            }
        }
    }

    getAdjacentNodes(pos: Vec2d) {
        this.validateNodePosition(pos);
        const offsets = [
            //left
            [-1, 0],
            //right
            [1, 0],
            //down
            [0, 1],
            // up
            [0, -1]
        ].map(e => pos.move(new Vec2d(e)));

        let result: { node: T; pos: Vec2d }[] = [];

        offsets.forEach(pos => {
            // ignore out of bounds
            try {
                this.validateNodePosition(pos);
            } catch (error) {
                return;
            }
            result = result.concat([{ pos, node: this.getNode(pos) }]);
        });

        return result;
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
