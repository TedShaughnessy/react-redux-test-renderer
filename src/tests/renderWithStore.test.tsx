import {
    defaultProps,
    defaultState,
    differentProps,
    differentState,
    getNullSafeTextContent,
    propSelector,
    statePropSelector,
} from './testHelper';
import ConnectedTestComponent from './testComponents/TestComponent';
import { cleanup, TestRenderer } from '../index';
import {
    propPassed,
    statePropFromStore,
    propDifferentPassed,
    propDefault,
    statePropDefault,
    statePropDifferentPassed,
} from './testComponents/Properties';

const connectedTestComponent = new TestRenderer(ConnectedTestComponent, defaultProps, defaultState);
const connectedTestComponent2 = new TestRenderer(ConnectedTestComponent);

afterEach(cleanup);

describe('renderWithStore works ', () => {
    it('with default props', () => {
        const result = connectedTestComponent.renderWithStore();

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropFromStore);
    });

    it('overriding default props', () => {
        const result = connectedTestComponent.renderWithStore(differentProps);

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDifferentPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropFromStore);
    });

    it('no props or state', () => {
        const result = connectedTestComponent.renderWithStore({}, {});

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDefault);
    });

    it('overriding state', () => {
        const result = connectedTestComponent.renderWithStore(undefined, differentState);

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDifferentPassed);
    });

    it('updating state with default props and state', () => {
        const result = connectedTestComponent2.renderWithStore();

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDefault);
    });

    it('updating state with TestComponent', () => {
        const result = connectedTestComponent.renderWithStore(undefined, defaultState);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropFromStore);

        connectedTestComponent.updateStateWithDispatch({ ...defaultState, stateProp: statePropDifferentPassed });

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDifferentPassed);
    });
});
