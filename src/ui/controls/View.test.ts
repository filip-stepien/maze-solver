// @vitest-environment jsdom

import { test, describe, expect } from 'vitest';
import { View } from './View';

describe('Adding children to DOM', () => {
    const view = new View();
    const viewElement = document.body.firstElementChild as HTMLElement;
    view.addChild(new View(), new View(), new View());

    describe('Setting property in runtime', () => {
        test('Converting number dimensions to px', () => {
            view.gap = 10;
            expect(viewElement.style.gap).toEqual('10px');
        });

        test('Handling string value', () => {
            view.gap = '5%';
            expect(viewElement.style.gap).toEqual('5%');
        });
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
