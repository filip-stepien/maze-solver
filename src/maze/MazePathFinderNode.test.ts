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

    test('Adding labels works', () => {
        const labels: MazePathFinderNodeStateLabel[] = ['start', 'queued'];
        node.addLabels(labels);
        labels.forEach(label => {
            expect(node.hasLabel(label)).toBeTruthy();
        });
    });

    test('labels getter', () => {
        const labels: MazePathFinderNodeStateLabel[] = ['start', 'queued'];
        node.addLabels(labels);
        expect(node.getLabels().size, 'label count to be correct').toEqual(2);
        node.getLabels().forEach(label => {
            expect(label).oneOf(labels);
        });
    });

    test('hasLabel', () => {
        expect(node.hasLabel('selected')).toBeFalsy();
    });

    test('Deleting label', () => {
        const labels: MazePathFinderNodeStateLabel[] = ['start', 'queued'];
        node.addLabels(labels);
        node.deleteLabels(['queued']);
        expect(node.hasLabel('queued'), 'label to be deleted').toBeFalsy();
        expect(node.getLabels().size, 'other labels to remain').toEqual(labels.length - 1);
    });

    test('Deleting labels', () => {
        const labels: MazePathFinderNodeStateLabel[] = ['start', 'queued', 'candidate'];
        node.addLabels(labels);
        node.deleteLabels(labels);
        expect(node.getLabels().size, 'all labels to be removed').toEqual(0);
    });
});
