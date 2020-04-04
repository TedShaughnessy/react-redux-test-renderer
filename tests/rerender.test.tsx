import { TestRenderer } from 'react-redux-test-renderer';
import { cleanup } from '@testing-library/react';
import {
  defaultProps,
  defaultState,
  differentProps,
  getNullSafeTextContent
} from './testHelper';
import ConnectedTestComponent, {
  TestComponent
} from '../testComponents/TestComponent';
import { TestWrapper } from '../testComponents/TestComponentWrapper';
import {
  statePropDefault,
  propDifferentPassed,
  propPassed,
  statePropFromStore
} from '../testComponents/Properties';

afterEach(cleanup);

const testComponentWithWrappers = new TestRenderer(
    TestComponent,
    defaultProps,
    defaultState
);
const firstWrapper = testComponentWithWrappers.addWrapper(TestWrapper, {
    name: 'one'
});

const connectedTestComponentWithWrappers = new TestRenderer(
    ConnectedTestComponent,
    defaultProps,
    defaultState
);
const firstConnectedWrapper = connectedTestComponentWithWrappers.addWrapper(
    TestWrapper,
    { name: 'one' }
);

describe('rerender works: ', () => {
    it('Without Store: ', () => {
        const result = testComponentWithWrappers
            .useWrapperProps(firstWrapper, { name: 'one-modified' })
            .addTemporaryWrapper(TestWrapper, { name: 'two-added' })
            .render();

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added > .one-modified > h3'
            )
        ).toEqual(statePropDefault);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added > .one-modified > h2'
            )
        ).toEqual(propPassed);

        result.rerender(differentProps);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added > .one-modified > h3'
            )
        ).toEqual(statePropDefault);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added > .one-modified > h2'
            )
        ).toEqual(propDifferentPassed);
    });

    it('Without Store, temporary wrapper and wrapper props are temporary: ', () => {
        const result = testComponentWithWrappers.render();

        expect(getNullSafeTextContent(result, 'body > div > .one > h3')).toEqual(
            statePropDefault
        );

        expect(getNullSafeTextContent(result, 'body > div > .one > h2')).toEqual(
            propPassed
        );

        result.rerender(differentProps);

        expect(getNullSafeTextContent(result, 'body > div > .one > h3')).toEqual(
            statePropDefault
        );

        expect(getNullSafeTextContent(result, 'body > div > .one > h2')).toEqual(
            propDifferentPassed
        );
    });

    it('With Store: ', () => {
        const result = connectedTestComponentWithWrappers
            .useWrapperProps(firstConnectedWrapper, { name: 'one-modified-s' })
            .addTemporaryWrapper(TestWrapper, { name: 'two-added-s' })
            .renderWithStore();

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added-s > .one-modified-s > h3'
            )
        ).toEqual(statePropFromStore);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added-s > .one-modified-s > h2'
            )
        ).toEqual(propPassed);

        result.rerender(differentProps);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added-s > .one-modified-s > h3'
            )
        ).toEqual(statePropFromStore);

        expect(
            getNullSafeTextContent(
                result,
                'body > div > .two-added-s > .one-modified-s > h2'
            )
        ).toEqual(propDifferentPassed);
    });

    it('With Store, temporary wrapper and wrapper props are temporary: ', () => {
        const result = connectedTestComponentWithWrappers.renderWithStore();

        result.rerender(differentProps);

        expect(getNullSafeTextContent(result, 'body > div > .one > h3')).toEqual(
            statePropFromStore
        );

        expect(getNullSafeTextContent(result, 'body > div > .one > h2')).toEqual(
            propDifferentPassed
        );
    });
});
