/* eslint-disable @typescript-eslint/ban-ts-comment */
import { test, expect, describe, assert, beforeAll } from 'vitest';
import { MazePathFinderNode, MazePathFinderNodeLabel } from './MazePathFinderNode';

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
        const labels: MazePathFinderNodeLabel[] = ['start', 'queued'];
        // @ts-ignore
        node.addLabels(labels);
        labels.forEach(label => {
            expect(node.hasLabel(label)).toBeTruthy();
        });
    });

    test('labels getter', () => {
        const labels: MazePathFinderNodeLabel[] = ['start', 'queued'];
        // @ts-ignore
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
        const labels: MazePathFinderNodeLabel[] = ['start', 'queued'];
        // @ts-ignore
        node.addLabels(labels);
        // @ts-ignore
        node.deleteLabels(['queued']);
        expect(node.hasLabel('queued'), 'label to be deleted').toBeFalsy();
        expect(node.getLabels().size, 'other labels to remain').toEqual(labels.length - 1);
    });

    test('Deleting labels', () => {
        const labels: MazePathFinderNodeLabel[] = ['start', 'queued', 'candidate'];
        // @ts-ignore
        node.addLabels(labels);
        // @ts-ignore
        node.deleteLabels(labels);
        expect(node.getLabels().size, 'all labels to be removed').toEqual(0);
    });
});
