import { assert, describe, expect, test } from 'vitest';
import { Vec2d } from './types';

test('Vec2d array constructor', () => {
    const vec = new Vec2d([6, 9]);

    assert.equal(vec.x, 6);
    assert.equal(vec.y, 9);
});

describe(`Vec2d move`, () => {
    const vec = new Vec2d([5, 5]);

    test('move by vector', () => {
        const offset = new Vec2d([1, -2]);
        const moved = vec.move(offset);
        assert.deepEqual(moved, new Vec2d([5 + 1, 5 - 2]));
    });
});
