// @vitest-environment jsdom

import { test, describe, beforeAll, expect } from 'vitest';
import { View } from './View';

describe('Adding children to DOM', () => {
    beforeAll(() => {
        const view = new View();
        view.addChild(new View(), new View(), new View());
    });

    test('Appending children to document body', () => {
        const totalElementCount = document.body.querySelectorAll('*').length;
        expect(totalElementCount).toEqual(4);
    });

    test('Nesting elements', () => {
        const bodyChildrenCount = document.body.childElementCount;
        const nestedViewsCount = document.body.firstChild.childNodes.length;

        expect(bodyChildrenCount).toEqual(1);
        expect(nestedViewsCount).toEqual(3);
    });
});
