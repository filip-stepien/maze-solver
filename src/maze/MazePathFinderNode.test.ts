import { test, expect, describe, assert, beforeAll } from 'vitest';
import { MazePathFinderNode, MazePathFinderNodeStateLabel } from './MazePathFinderNode';

test('MazePathFinderNode has working no args constuctor', () => {
    assert.doesNotThrow(() => {
        new MazePathFinderNode();
    });
});

describe('MazePathFinderNode labels', () => {
    let node: MazePathFinderNode;

    beforeAll(() => {
        node = new MazePathFinderNode();
    });

    test('labels getter works', () => {
        expect(node.getLabels().size, 'default initialized node to not have lables').toEqual(0);
    });

    test('hasLabel', () => {
        expect(node.hasLabel('selected')).toBeFalsy();
    });

    test('Adding labels works', () => {
        const labels: MazePathFinderNodeStateLabel[] = ['start', 'queued'];
        node.addLabels(labels);
        labels.forEach(label => {
            expect(node.hasLabel).toBeTruthy();
        });
    });
});
