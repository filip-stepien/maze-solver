import chalk from 'chalk';

export type MazeNodeLabel = 'colliding' | 'noncolliding';

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

    protected getDisplayedLabel(): string {
        if (this.isColliding()) {
            return 'colliding';
        } else {
            return 'noncolliding';
        }
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
