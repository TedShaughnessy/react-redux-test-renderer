import * as React from 'react';

import { defaultProps, defaultState, differentProps, differentState } from './testHelper';
import ConnectedTestComponent, {
    propDefault,
    propDifferentPassed,
    propPassed,
    statePropDefault,
    statePropDifferentPassed,
    statePropFromStore,
    TestComponent,
} from './testComponents/TestComponent';
import { cleanup, TestRenderer } from '../index';
import { TestWrapper } from './testComponents/TestWrapper';

afterEach(cleanup);

const testComponentWithWrappers = new TestRenderer(TestComponent, defaultProps, defaultState);
const firstWrapper = testComponentWithWrappers.addWrapper(TestWrapper, { name: 'one' });

const connectedTestComponentWithWrappers = new TestRenderer(
    ConnectedTestComponent,
    defaultProps,
    defaultState
);
const firstConnectedWrapper = connectedTestComponentWithWrappers.addWrapper(TestWrapper, { name: 'one' });

describe('rerender works: ', () => {

    it('Without Store: ', () => {
        const result = testComponentWithWrappers
            .useWrapperProps(firstWrapper, {name: 'one-modified'})
            .addTemporaryWrapper(TestWrapper, {name: 'two-added'})
            .render();

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added > .one-modified > h3').textContent).toEqual(statePropDefault);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added > .one-modified > h2').textContent).toEqual(propPassed);

        result.rerender(differentProps);

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added > .one-modified > h3').textContent).toEqual(statePropDefault);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added > .one-modified > h2').textContent).toEqual(propDifferentPassed);
    });

    it('Without Store, temporary wrapper and wrapper props are temporary: ', () => {
        const result = testComponentWithWrappers.render();

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h3').textContent).toEqual(statePropDefault);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h2').textContent).toEqual(propPassed);

        result.rerender(differentProps);

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h3').textContent).toEqual(statePropDefault);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h2').textContent).toEqual(propDifferentPassed);
    });

    it('With Store: ', () => {
        const result = connectedTestComponentWithWrappers
            .useWrapperProps(firstConnectedWrapper, {name: 'one-modified-s'})
            .addTemporaryWrapper(TestWrapper, {name: 'two-added-s'})
            .renderWithStore();

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added-s > .one-modified-s > h3').textContent).toEqual(statePropFromStore);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added-s > .one-modified-s > h2').textContent).toEqual(propPassed);

        result.rerender(differentProps);

        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added-s > .one-modified-s > h3').textContent).toEqual(statePropFromStore);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .two-added-s > .one-modified-s > h2').textContent).toEqual(propDifferentPassed);
    });

    it('With Store, temporary wrapper and wrapper props are temporary: ', () => {
        const result = connectedTestComponentWithWrappers.renderWithStore();

        result.rerender(differentProps);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h3').textContent).toEqual(statePropFromStore);
        //@ts-ignore
        expect(result.baseElement.querySelector('body > div > .one > h2').textContent).toEqual(propDifferentPassed);
    });
});
