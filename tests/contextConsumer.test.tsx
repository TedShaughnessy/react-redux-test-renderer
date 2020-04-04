import { TestRenderer } from 'react-redux-test-renderer';
import { cleanup } from '@testing-library/react';
import {
  defaultProps,
  defaultState,
  getNullSafeTextContent
} from './testHelper';
import { TestContextConsumerComponent } from '../testComponents/TestContextConsumerComponent';
import {
  defaultContextState,
  TestContext
} from '../testComponents/TestContextProviderWrapper';

const testComponentWithContext = new TestRenderer(
    TestContextConsumerComponent,
    defaultProps,
    defaultState
);
const contextValue = testComponentWithContext.addContextProvider(TestContext, {
    ...defaultContextState,
    contextProp: 1
});

const selector = 'body > div > h3';

afterEach(cleanup);

describe('adding context provider wrapper works: ', () => {
    it('context consumer component', () => {
        const result = testComponentWithContext.render();

        expect(getNullSafeTextContent(result, selector)).toEqual('1');
    });
    it('context consumer component', () => {
        const result = testComponentWithContext
            .useContextValue(contextValue, { ...defaultContextState, contextProp: 2 })
            .render();

        expect(getNullSafeTextContent(result, selector)).toEqual('2');
    });
});
