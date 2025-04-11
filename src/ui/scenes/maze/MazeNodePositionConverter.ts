import { Vector3 } from 'three';
import { Vec2d } from '../../../types';

export class MazeNodePositionConverter {
    private _gap: number;
    private _boxSize: number;

    constructor(gap: number, boxSize: number) {
        this._gap = gap;
        this._boxSize = boxSize;
    }

    public nodeToBoxPosition(nodePos: Vec2d) {
        const toBoxPos = (dimension: number) => dimension * this._boxSize * 2 * (1 + this._gap);

        return {
            path: new Vector3(toBoxPos(nodePos.x), 0, toBoxPos(nodePos.y)),
            wall: new Vector3(toBoxPos(nodePos.x), -1000, toBoxPos(nodePos.y)),
            abovePath: new Vector3(toBoxPos(nodePos.x), 1, toBoxPos(nodePos.y))
        };
    }

    public boxToNodePosition(boxPos: Vector3): Vec2d {
        const fromBoxPos = (value: number) =>
            Math.round(value / (this._boxSize * 2 * (1 + this._gap)));

        return new Vec2d([fromBoxPos(boxPos.x), fromBoxPos(boxPos.z)]);
    }
}
