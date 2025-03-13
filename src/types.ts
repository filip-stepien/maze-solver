interface Point {
    x: number;
    y: number;
}

export class Vec2d implements Point {
    x: number;
    y: number;

    constructor(arg: Point | Array<number> | number[]) {
        if (typeof arg === 'object' && !Array.isArray(arg)) {
            this.x = arg.x;
            this.y = arg.y;
        } else if (Array.isArray(arg) && arg.length === 2) {
            this.x = arg[0];
            this.y = arg[1];
        }
    }

    /**
     *
     * @param offset vector of movement
     * @returns Vector after apllying offset
     *
     * @note this does not mutate object called on
     */
    move(offset: Vec2d) {
        return new Vec2d({
            x: this.x + offset.x,
            y: this.y + offset.y
        });
    }

    equals(other: Vec2d) {
        return this.x === other.x && this.y === other.y;
    }
}

export type MazePath = Vec2d[];
