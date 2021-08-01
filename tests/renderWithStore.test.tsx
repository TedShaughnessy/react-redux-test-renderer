import { TestRenderer } from 'react-redux-test-renderer';
import {
  defaultProps,
  defaultState,
  differentProps,
  differentState,
  getNullSafeTextContent,
  propSelector,
  statePropSelector
} from './testHelper';
import ConnectedTestComponent from '../testComponents/TestComponent';
import {
  propPassed,
  statePropFromStore,
  propDifferentPassed,
  propDefault,
  statePropDefault,
  statePropDifferentPassed
} from '../testComponents/Properties';
import React from 'react';

const connectedTestComponent = new TestRenderer(
    ConnectedTestComponent,
    defaultProps,
    defaultState
);
const connectedTestComponent2 = new TestRenderer(ConnectedTestComponent);

describe('renderWithStore works ', () => {
    it('renders children', () => {
        const result = connectedTestComponent.renderWithStore(undefined, undefined, [<p key="1">1</p>, <p key="2">2</p>]);
    
            result.getByText('1');
            result.getByText('2');
        });
    it('with default props', () => {
        const result = connectedTestComponent.renderWithStore();

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropFromStore
        );
    });

    it('overriding default props', () => {
        const result = connectedTestComponent.renderWithStore(differentProps);

        expect(getNullSafeTextContent(result, propSelector)).toEqual(
            propDifferentPassed
        );

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropFromStore
        );
    });

    it('no props or state', () => {
        const result = connectedTestComponent.renderWithStore({}, {});

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropDefault
        );
    });

    it('overriding state', () => {
        const result = connectedTestComponent.renderWithStore(
            undefined,
            differentState
        );

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropDifferentPassed
        );
    });

    it('updating state with default props and state', () => {
        const result = connectedTestComponent2.renderWithStore();

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropDefault
        );
    });

    it('updating state with TestComponent', () => {
        const result = connectedTestComponent.renderWithStore(
            undefined,
            defaultState
        );

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropFromStore
        );

        connectedTestComponent.updateStateWithDispatch({
            ...defaultState,
            stateProp: statePropDifferentPassed
        });

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(
            statePropDifferentPassed
        );
    });
});
