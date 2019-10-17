import * as React from 'react';

import { defaultProps, defaultState, differentProps, differentState } from './testHelper';
import ConnectedTestComponent, {
    propDefault,
    propDifferentPassed,
    propPassed,
    statePropDefault,
    statePropDifferentPassed,
    statePropFromStore,
} from './testComponents/TestComponent';
import {cleanup, TestRenderer } from '../index';

const connectedTestComponent = new TestRenderer(ConnectedTestComponent, defaultProps, defaultState);
const connectedTestComponent2 = new TestRenderer(ConnectedTestComponent);

afterEach(cleanup);

describe('renderWithStore works ', () => {
    it('with default props', () => {
        const result = connectedTestComponent.renderWithStore();

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propPassed);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropFromStore);
    });

    it('overriding default props', () => {
        const result = connectedTestComponent.renderWithStore(differentProps);

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDifferentPassed);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropFromStore);
    });

    it('no props or state', () => {
        const result = connectedTestComponent.renderWithStore({}, {});

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDefault);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDefault);
    });

    it('overriding state', () => {
        const result = connectedTestComponent.renderWithStore(undefined, differentState);

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propPassed);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDifferentPassed);
    });

    it('updating state with default props and state', () => {
        const result = connectedTestComponent2.renderWithStore();

        // @ts-ignore
        expect(result.baseElement.querySelector('h2').textContent).toEqual(propDefault);
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDefault);
    });

    it('updating state with TestComponent', () => {
        const result = connectedTestComponent.renderWithStore(undefined, defaultState);

        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropFromStore);

        connectedTestComponent.updateStateWithDispatch({ ...defaultState, stateProp: statePropDifferentPassed });
        // @ts-ignore
        expect(result.baseElement.querySelector('h3').textContent).toEqual(statePropDifferentPassed);
    });
});