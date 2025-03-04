class MazeNode {
    public constructor() {}

    private m_isSolid: boolean;

    public setIsSolid(isSolid: boolean) {
        this.m_isSolid = isSolid;
    }

    public isSolid() {
        return this.isSolid;
    }
}

export class Maze<T extends MazeNode> {
    public constructor(x?: number, y?: number, data?: T[][]) {
        if (data) {
            this.m_matrix = data;
            return;
        }
        if (x && y) {
            for (let i = 0; i < y; ++i) {
                const tarr = Array.from({ length: x }, () => new MazeNode());
                for (let j = 0; j < x; ++j) {}
            }
        }
    }

    private m_matrix: MazeNode[][];

    public isSolid(x: number, y: number): boolean {
        return;
    }

    public valueOf(): string {
        let str = '';
        this.m_matrix.forEach(e => {
            e.forEach(node => {
                str += node.isSolid() ? '▓' : ' ';
            });
            str += '\n';
        });
        return str;
    }
}
