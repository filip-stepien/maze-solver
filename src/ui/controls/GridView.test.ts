// @vitest-environment jsdom

import { expect, test, describe } from 'vitest';
import { GridView } from './GridView';

const grid = new GridView();
const gridElement = document.body.firstElementChild as HTMLElement;

test('Grid display property initialization', () => {
    expect(gridElement.style.display).toEqual('grid');
});

describe('Setting grid pattern', () => {
    test('Using numbers', () => {
        grid.columns = [1, 1];
        grid.rows = [1, 1];

        expect(gridElement.style.gridTemplateColumns).toEqual('1fr 1fr');
        expect(gridElement.style.gridTemplateRows).toEqual('1fr 1fr');
    });

    test('Using strings with CSS units', () => {
        grid.columns = ['100%', '50em'];
        grid.rows = ['100%', '50em'];

        expect(gridElement.style.gridTemplateColumns).toEqual('100% 50em');
        expect(gridElement.style.gridTemplateRows).toEqual('100% 50em');
    });
});

describe('Setting grid item placement', () => {
    test('Using single value', () => {
        grid.itemPlacement = 'center';
        expect(gridElement.style.placeItems).toEqual('center');
    });

    test('Using two values for columns and rows', () => {
        grid.itemPlacement = ['center', 'left'];
        expect(gridElement.style.placeItems).toEqual('center left');
    });
});
