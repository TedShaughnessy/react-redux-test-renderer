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

const testComponentWithWrappers = new TestRenderer(TestComponent, defaultProps, defaultState);
testComponentWithWrappers.addWrapper(TestWrapper, { name: 'one' });
testComponentWithWrappers.addWrapper(TestWrapper, { name: 'two' });
testComponentWithWrappers.addWrapper(TestWrapper, { name: 'three' });

const connectedTestComponentWithWrappers = new TestRenderer(
    ConnectedTestComponent,
    defaultProps,
    defaultState
);
connectedTestComponentWithWrappers.addWrapper(TestWrapper, { name: 'one' });
const secondWrapper = connectedTestComponentWithWrappers.addWrapper(TestWrapper, { name: 'two' });
const thirdWrapper = connectedTestComponentWithWrappers.addWrapper(TestWrapper, { name: 'three' });

const selector = 'body > div > .three > .two > .one > h3';

afterEach(cleanup);

describe('adding wrappers works: ', () => {

    it('wrapped test component', () => {
        const result = testComponentWithWrappers.render();

        // @ts-ignore
        expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropDefault);
    });
    it('wrapped connected test component', () => {
        const result = connectedTestComponentWithWrappers.renderWithStore();

        // @ts-ignore
        expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropFromStore);
    });
    it('wrapped and with temporary wrapper props and connected test component', () => {
        const result = connectedTestComponentWithWrappers
            .useWrapperProps(thirdWrapper, { name: 'third-modified' })
            .renderWithStore();

        const modifiedSelector = 'body > div > .third-modified > .two > .one > h3';
        // @ts-ignore
        expect(result.baseElement.querySelector(modifiedSelector).textContent).toEqual(statePropFromStore);
    });
    it('wrapped and with temporary wrapper props test component', () => {
        const result = testComponentWithWrappers
            .useWrapperProps(thirdWrapper, { name: 'third-modified' })
            .render();

        const modifiedSelector = 'body > div > .third-modified > .two > .one > h3';
        // @ts-ignore
        expect(result.baseElement.querySelector(modifiedSelector).textContent).toEqual(statePropDefault);
    });
    it('modified wrapper props are temporary', () => {
        const result = testComponentWithWrappers.render();

        // @ts-ignore
        expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropDefault);
    });
    it('modified wrapper props are temporary for connected components', () => {
        const result = connectedTestComponentWithWrappers.renderWithStore();

        // @ts-ignore
        expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropFromStore);
    });
    it('modified wrapper props do not persist when changing different wrapper props', () => {
        const result = testComponentWithWrappers
            .useWrapperProps(secondWrapper, { name: 'second-modified' })
            .render();
        const modifiedSelector = 'body > div > .three > .second-modified > .one > h3';
        // @ts-ignore
        expect(result.baseElement.querySelector(modifiedSelector).textContent).toEqual(statePropDefault);
        });
        it('modified wrapper props do not persist when changing different wrapper props, connect component', () => {
            const result = connectedTestComponentWithWrappers
                .useWrapperProps(secondWrapper, { name: 'second-modified' })
                .renderWithStore();

            const modifiedSelector = 'body > div > .three > .second-modified > .one > h3';
            // @ts-ignore
            expect(result.baseElement.querySelector(modifiedSelector).textContent).toEqual(statePropFromStore);
        });
    });
