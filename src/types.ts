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
}

export type MazePath = Array<Vec2d>[];
