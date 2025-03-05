interface Point {
    x: number;
    y: number;
}

export class Vec2d implements Point {
    x: number;
    y: number;

    constructor(arg: Point | Array<number>[2]) {
        if (typeof arg === 'object' && !Array.isArray(arg)) {
            this.x = arg.x;
            this.y = arg.y;
        } else if (Array.isArray(arg) && arg.length === 2) {
            this.x = arg[0];
            this.x = arg[1];
        }
    }

    toString() {
        return [this.x, this.y];
    }
}

export type MazePath = Array<Vec2d>[];
