interface Point {
    x: number;
    y: number;
}

export class Vec2d implements Point {
    x: number;
    y: number;

    // FIXME constuctor not setting shit ?
    constructor(arg: Point | Array<number> | number[]) {
        if (typeof arg === 'object' && !Array.isArray(arg)) {
            console.debug('with object construction');
            this.x = arg.x;
            this.y = arg.y;
        } else if (Array.isArray(arg) && arg.length === 2) {
            this.x = arg[0];
            this.x = arg[1];
        }
        console.debug(this);
    }

    toString() {
        return [this.x, this.y];
    }
}

export type MazePath = Array<Vec2d>[];
