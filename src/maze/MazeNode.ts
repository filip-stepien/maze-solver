export type MazeNodeLabel = 'colliding' | 'noncolliding';

export type CharacterData = {
    fontAwesomeName: string;
    icon: string;
    color: string;
    bgColor?: string;
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

    protected getRepresentation(): CharacterData {
        if (this.isColliding()) {
            return { icon: '▓', fontAwesomeName: 'square-full', color: 'gray' };
        } else {
            return { icon: '', fontAwesomeName: 'dot-circle', color: 'gray' };
        }
    }

    toString(): string {
        return this.getRepresentation().icon;
    }

    clone() {
        const clone = structuredClone(this);
        return clone;
    }
}
