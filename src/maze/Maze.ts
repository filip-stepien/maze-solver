export class MazeNode {
    private m_isSolid: boolean;

    constructor({ isSolid }: { isSolid: boolean }) {
        this.m_isSolid = isSolid;
    }

    setIsSolid(isSolid: boolean): void {
        this.m_isSolid = isSolid;
    }

    isSolid(): boolean {
        return this.m_isSolid;
    }
}

export class Maze<T extends MazeNode> {
    protected m_matrix: MazeNode[][];

    protected x: number;
    protected y: number;

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
        x,
        y,
        initializer,
        data
    }: {
        x?: number;
        y?: number;
        initializer?: T;
        data?: T[][];
    }) {
        if (data) {
            this.m_matrix = data;
            return;
        }

        if (x && y && initializer) {
            this.x = x;
            this.y = y;
            this.m_matrix = Array.from(
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
        }
    }

    public isSolid(x: number, y: number): boolean {
        return;
    }

    public toString(): string {
        let str = '';
        this.m_matrix.forEach(e => {
            e.forEach(node => {
                console.debug(node);
                str += node.isSolid() ? '▓' : ' ';
            });
            str += '\n';
        });
        return str;
    }

    public transformNode(x: number, y: number, transform: (node: MazeNode) => MazeNode): void {
        console.debug('transformNode');
        const oldNode: MazeNode = this.m_matrix[x][y];
        console.debug('old node', oldNode);
        const node: MazeNode = transform(oldNode);
        console.debug('transformed', oldNode);
        this.m_matrix[y][x] = node;
        console.debug(this.m_matrix);
    }
}
