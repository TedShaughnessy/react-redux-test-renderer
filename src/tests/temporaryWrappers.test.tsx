import { defaultProps, defaultState, getNullSafeTextContent } from './testHelper';
import ConnectedTestComponent, {
    statePropDefault,
    statePropFromStore,
    TestComponent,
} from './testComponents/TestComponent';
import { cleanup, TestRenderer } from '../index';
import { TestWrapper } from './testComponents/TestWrapper';

afterEach(cleanup);

describe('adding temporary wrappers works: ', () => {
    describe('Without Store: ', () => {
        const testComponent3 = new TestRenderer(TestComponent);
        testComponent3.addWrapper(TestWrapper, { name: 'one' });

        const selector = 'body > div > .three > .two > .one > h3';
        it('one temporary wrapper', () => {
            const result = testComponent3.addTemporaryWrapper(TestWrapper, { name: 'two' }).render();

            expect(getNullSafeTextContent(result, 'body > div > .two > .one > h3')).toEqual(statePropDefault);
        });
        it('default wrapper only', () => {
            expect(getNullSafeTextContent(testComponent3.render(), 'body > div > .one > h3')).toEqual(statePropDefault);
        });
        it('two temporary wrappers', () => {
            const result = testComponent3
                .addTemporaryWrapper(TestWrapper, { name: 'two' })
                .addTemporaryWrapper(TestWrapper, { name: 'three' })
                .render();

            expect(getNullSafeTextContent(result, selector)).toEqual(statePropDefault);
        });
        it('default wrapper only', () => {
            expect(getNullSafeTextContent(testComponent3.render(), 'body > div > .one > h3')).toEqual(statePropDefault);
        });
    });

    describe('With Store: ', () => {
        const testComponent4 = new TestRenderer(ConnectedTestComponent, defaultProps, defaultState);
        testComponent4.addWrapper(TestWrapper, { name: 'one' });

        const selector = 'body > div > .three > .two > .one > h3';

        it('one temporary wrapper', () => {
            const result = testComponent4.addTemporaryWrapper(TestWrapper, { name: 'two' }).renderWithStore();

            expect(getNullSafeTextContent(result, 'body > div > .two > .one > h3')).toEqual(statePropFromStore);
        });
        it('default wrapper only', () => {
            expect(getNullSafeTextContent(testComponent4.renderWithStore(), 'body > div > .one > h3')).toEqual(
                statePropFromStore
            );
        });
        it('two temporary wrappers', () => {
            const result = testComponent4
                .addTemporaryWrapper(TestWrapper, { name: 'two' })
                .addTemporaryWrapper(TestWrapper, { name: 'three' })
                .renderWithStore();

            expect(getNullSafeTextContent(result, selector)).toEqual(statePropFromStore);
        });
        it('default wrapper only', () => {
            expect(getNullSafeTextContent(testComponent4.renderWithStore(), 'body > div > .one > h3')).toEqual(
                statePropFromStore
            );
        });
    });
});
