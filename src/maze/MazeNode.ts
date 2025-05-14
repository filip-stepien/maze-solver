import chalk from 'chalk';

export type MazeNodeLabel = 'colliding' | 'noncolliding';

export type CharacterData = {
    fontAwesomeName: string;
    icon: string;
};

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

    protected getCharacter(): CharacterData {
        if (this.isColliding()) {
            return { icon: '▓', fontAwesomeName: 'square-full' };
        } else {
            return { icon: '', fontAwesomeName: 'dot-circle' };
        }
    }

    toString(): string {
        return this.getCharacter().icon;
    }

    clone() {
        const clone = structuredClone(this);
        return clone;
    }
}
