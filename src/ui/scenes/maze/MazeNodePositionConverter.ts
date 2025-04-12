import { Vector3 } from 'three';
import { Vec2d } from '../../../types';

export type BoxPosition = {
    path: Vector3;
    wall: Vector3;
    abovePath: Vector3;
};

export type BoxInfo = {
    i: number;
    j: number;
    x: number;
    z: number;
};

export class MazeNodePositionConverter {
    private _gap: number;
    private _boxSize: number;

    private _BOX_HEIGHTS: Record<keyof BoxPosition, number> = {
        path: 0,
        wall: -1000,
        abovePath: 1
    };

    constructor(gap: number, boxSize: number) {
        this._gap = gap;
        this._boxSize = boxSize * 2;
    }

    private getBoxInfo(point: Vector3, mazeSize: Vec2d): BoxInfo | null {
        const spacing = this._boxSize + this._gap;
        const { x, z } = point;

        const i = Math.floor(x / spacing);
        const j = Math.floor(z / spacing);

        if (i < 0 || i >= mazeSize.x || j < 0 || j >= mazeSize.y) {
            return null;
        }

        const boxX = i * spacing;
        const boxZ = j * spacing;

        const withinBox =
            x >= boxX && x < boxX + this._boxSize && z >= boxZ && z < boxZ + this._boxSize;

        return withinBox ? { i, j, x: boxX, z: boxZ } : null;
    }

    public nodeToBoxPosition(pos: Vec2d): BoxPosition {
        const toBoxPos = (dimension: number) => dimension * this._boxSize * (1 + this._gap);
        return {
            path: new Vector3(toBoxPos(pos.x), this._BOX_HEIGHTS.path, toBoxPos(pos.y)),
            wall: new Vector3(toBoxPos(pos.x), this._BOX_HEIGHTS.wall, toBoxPos(pos.y)),
            abovePath: new Vector3(toBoxPos(pos.x), this._BOX_HEIGHTS.abovePath, toBoxPos(pos.y))
        };
    }

    public boxToNodePosition(pos: Vector3): Vec2d {
        const fromBoxPos = (value: number) => Math.round(value / (this._boxSize * (1 + this._gap)));
        return new Vec2d([fromBoxPos(pos.x), fromBoxPos(pos.z)]);
    }

    public pointToNodePosition(point: Vector3, mazeSize: Vec2d): Vec2d | null {
        const box = this.getBoxInfo(point, mazeSize);
        return box ? new Vec2d([box.i, box.j]) : null;
    }

    public pointToBoxPosition(point: Vector3, mazeSize: Vec2d): BoxPosition | null {
        const box = this.getBoxInfo(point, mazeSize);
        if (!box) return null;

        return {
            path: new Vector3(box.x, this._BOX_HEIGHTS.path, box.z),
            wall: new Vector3(box.x, this._BOX_HEIGHTS.wall, box.z),
            abovePath: new Vector3(box.x, this._BOX_HEIGHTS.abovePath, box.z)
        };
    }

    public boxToBoxPosition(pos: Vector3, height: keyof BoxPosition) {
        return new Vector3(pos.x, this._BOX_HEIGHTS[height], pos.z);
    }
}
