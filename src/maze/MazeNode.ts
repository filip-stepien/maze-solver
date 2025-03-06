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

    protected getCharacter(): string {
        if (this.isColliding()) {
            return '▓';
        } else {
            return '·';
        }
    }

    toString(): string {
        return this.getCharacter();
    }

    clone() {
        const clone = structuredClone(this);
        return clone;
    }
}
