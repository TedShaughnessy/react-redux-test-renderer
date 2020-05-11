# React-Redux-Test-Renderer

- Simplifies the setup of components using redux, context and other wrappers.
- It uses @testing-library and all its functionality is still available.
- All methods have type declarations and descriptions.

Please ensure your package versions are compatible with the peerDependancies required.

## Simple Example

```tsx
import { TestRenderer } from 'react-redux-test-renderer';
import { cleanup } from '@testing-library/react';

const testComponent = new TestRenderer(ReactComponent);

afterEach(cleanup);

describe('test', () => {
    it('dispatches action when clicked', () => {
        const result = testComponent.render();
        
        const button = result.queryselector('#button');
        fireEvent.click(button);

        const actions = testComponent.getCountForAllActions();
        const buttonAction = testComponent.getCountForAction('BUTTON_CLICKED');
        
        expect(actions.length).toBe(1);
        expect(buttonAction.length).toBe(1);
    });
        it('renders children', () => {
        const result = testComponent.render(undefined, [<p key="1">1</p>, <p key="2">2</p>]);
    
            result.getByText('1');
            result.getByText('2');
        });
    });
});
```

## Complex Examples

```typescript
import { TestRenderer } from 'react-redux-test-renderer';
import { cleanup } from '@testing-library/react';

const testComponent = new TestRenderer(ReactComponent, initialProps, initialState);
const router = testComponent.addWrapper(MemoryRouter, { initialEntries: ['/'] });
const context = testComponent.addContextProvider(Context, value);

afterEach(cleanup);

describe('test', () => {
    it('action hides button', async () => {
        const result = testComponent.renderWithStore();
        const radio = result.baseElement.querySelector('#radioButton');

        expect(radio).toBeInTheDocument();
        await testComponent.updateStateWithDispatch({ ...initialState, buttonHidden: true });
    
        expect(radio).not.toBeInTheDocument();
    });
    it('routes to a page', async () => {
        const result = testComponent
            .useWrapperProps(router, { initialEntries: [`/${route}/`] })
            .useContextValue(context)
            .renderWithStore(Provider);
    
        await waitForElement(() => result.getByText('welcome to route'));
    });
    it('uses rerender and a temporary wrapper for an example', async () => {
        const result = testComponent
            .useWrapperProps(router, { initialEntries: [`/${route}/`] })
            .useTemporaryWrapper(Container, {})
            .renderWithStore(Provider);

        // rerenders with existing component with temporary wrappers, takes new properties
        const rerenderResult = result.rerender({});
        
        expect(something);
    });
});
```