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

describe('adding temporary wrappers works: ', () => {

    describe('Without Store: ', () => {
        const testComponent3 = new TestRenderer(TestComponent);
        testComponent3.addWrapper(TestWrapper, {name: 'one'});

        const selector = 'body > div > .three > .two > .one > h3';
        it('one temporary wrapper', () => {
            const result = testComponent3.addTemporaryWrapper(TestWrapper, {name: 'two'}).render();

            // @ts-ignore
            expect(result.baseElement.querySelector('body > div > .two > .one > h3').textContent).toEqual(
                statePropDefault
            );
        });
        it('default wrapper only', () => {
            // @ts-ignore
            expect(testComponent3.render().baseElement.querySelector('body > div > .one > h3').textContent).toEqual(
                statePropDefault
            );
        });
        it('two temporary wrappers', () => {
            const result = testComponent3
                .addTemporaryWrapper(TestWrapper, {name: 'two'})
                .addTemporaryWrapper(TestWrapper, {name: 'three'})
                .render();

            // @ts-ignore
            expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropDefault);
        });
        it('default wrapper only', () => {
            // @ts-ignore
            expect(testComponent3.render().baseElement.querySelector('body > div > .one > h3').textContent).toEqual(
                statePropDefault
            );
        });
    });

    describe('With Store: ', () => {
        const testComponent4 = new TestRenderer(ConnectedTestComponent,
            defaultProps,
            defaultState);
        testComponent4.addWrapper(TestWrapper, {name: 'one'});

        const selector = 'body > div > .three > .two > .one > h3';

        it('one temporary wrapper', () => {
            const result = testComponent4.addTemporaryWrapper(TestWrapper, {name: 'two'}).renderWithStore();

            // @ts-ignore
            expect(result.baseElement.querySelector('body > div > .two > .one > h3').textContent).toEqual(
                statePropFromStore
            );
        });
        it('default wrapper only', () => {
            // @ts-ignore
            expect(testComponent4.renderWithStore().baseElement.querySelector('body > div > .one > h3').textContent).toEqual(
                statePropFromStore
            );
        });
        it('two temporary wrappers', () => {
            const result = testComponent4
                .addTemporaryWrapper(TestWrapper, {name: 'two'})
                .addTemporaryWrapper(TestWrapper, {name: 'three'})
                .renderWithStore();

            // @ts-ignore
            expect(result.baseElement.querySelector(selector).textContent).toEqual(statePropFromStore);
        });
        it('default wrapper only', () => {
            // @ts-ignore
            expect(testComponent4.renderWithStore().baseElement.querySelector('body > div > .one > h3').textContent).toEqual(statePropFromStore);
        });
    });
});
