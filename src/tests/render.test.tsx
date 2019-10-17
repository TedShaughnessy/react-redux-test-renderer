import * as React from 'react';
import {defaultProps, defaultState, differentProps} from './testHelper';
import {propDefault, propDifferentPassed, statePropDefault, TestComponent,} from './testComponents/TestComponent';
import {cleanup, TestRenderer} from '../index';

const testComponent = new TestRenderer(TestComponent, defaultProps, defaultState);
const testComponent2 = new TestRenderer(TestComponent);

afterEach(cleanup);

describe('render works ', () => {

    it('overriding default props', () => {
        const result = testComponent.render(differentProps);

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDifferentPassed);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDefault);
    });
    it('no props', () => {
        const result = testComponent.render({});

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDefault);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDefault);
    });
    it('no props and no defaults', () => {
        const result = testComponent2.render();

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDefault);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDefault);
    });
});
