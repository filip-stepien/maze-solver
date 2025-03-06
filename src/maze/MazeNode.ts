import chalk from 'chalk';

export class MazeNode {
    public static initializer = new this();

    private m_isSolid: boolean = false;

    makeColliding(): void {
        this.m_isSolid = true;
    }

    makeNotColliding(): void {
        this.m_isSolid = false;
    }

    isColliding(): boolean {
        return this.m_isSolid;
    }

    toString(): string {
        if (this.isColliding()) {
            return chalk.grey('▓');
        } else {
            return chalk.grey('·');
        }
    }

    clone() {
        const clone = structuredClone(this);
        return clone;
    }
}
