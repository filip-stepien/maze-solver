// @vitest-environment jsdom

import { expect, test } from 'vitest';
import { FlexView } from './FlexView';

const flexView = new FlexView();
const flexElement = document.body.firstChild as HTMLElement;

test('Flex display property initialization', () => {
    expect(flexElement.style.display).toEqual('flex');
});

test('Setting flex properties in runtime', () => {
    expect(flexElement.style.direction).toBeFalsy();
    expect(flexElement.style.justifyContent).toBeFalsy();
    expect(flexElement.style.alignItems).toBeFalsy();

    const direction = 'column';
    const justifyContent = 'center';
    const alignItems = 'center';

    flexView.direction = direction;
    flexView.justifyContent = justifyContent;
    flexView.alignItems = alignItems;

    expect(flexElement.style.flexDirection).toEqual(direction);
    expect(flexElement.style.justifyContent).toEqual(justifyContent);
    expect(flexElement.style.alignItems).toEqual(alignItems);
});
