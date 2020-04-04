# React-Redux-Test-Renderer
simplifies the setup of components dependant on wrappers and providers

## Simple Example (with jest and testing libary)

```typescript
import { TestRenderer, cleanup } from 'react-redux-test-renderer';

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
});
```


## Complex Examples

```typescript
import { TestRenderer, cleanup } from 'react-redux-test-renderer';

const testComponent = new TestRenderer(ReactComponent, initialProps, initialState);
const router = testComponent.addWrapper(MemoryRouter, { initialEntries: ['/'] });
testComponent.addContextProvider(Context, value);

afterEach(cleanup);

describe('test', () => {
    it('action hides button', async () => {
        const result = testComponent.renderWithStore();
        const radio = result.baseElement.querySelector('#radioButton');

        expect(radio).toBeInTheDocument();
        await testComponent.updateStateWithDispatch({ ...initialState, buttonHidden: true });
    
        expect(radio).not.toBeInTheDocument();
    });
    it('routes to page', async () => {
        const result = testComponent
            .useWrapperProps(router, { initialEntries: [`/${route}/`] })
            .renderWithStore(Provider);
    
        await waitForElement(() => result.getByText('welcome to route'));
    });
    it('uses rerender and a temporary wrapper for an example', async () => {
        const result = testComponent
            .useWrapperProps(router, { initialEntries: [`/${route}/`] })
            .useTemporaryWrapper(Container, {})
            .renderWithStore(Provider);

        // rerenders with existing component with temporary wrappers, takes newProps object
        const rerenderResult = result.rerender({});
        
        expect(something);
    });
});
```
