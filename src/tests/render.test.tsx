import {
    defaultProps,
    defaultState,
    differentProps,
    getNullSafeTextContent,
    propSelector,
    statePropSelector,
} from './testHelper';
import { propDefault, propDifferentPassed, statePropDefault, TestComponent } from './testComponents/TestComponent';
import { cleanup, TestRenderer } from '../index';

const testComponent = new TestRenderer(TestComponent, defaultProps, defaultState);
const testComponent2 = new TestRenderer(TestComponent);

afterEach(cleanup);

describe('render works ', () => {
    it('overriding default props', () => {
        const result = testComponent.render(differentProps);

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDifferentPassed);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDefault);
    });
    it('no props', () => {
        const result = testComponent.render({});

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDefault);
    });
    it('no props and no defaults', () => {
        const result = testComponent2.render();

        expect(getNullSafeTextContent(result, propSelector)).toEqual(propDefault);

        expect(getNullSafeTextContent(result, statePropSelector)).toEqual(statePropDefault);
    });
});
