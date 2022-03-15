<div align="center">
<h1>React Redux Test Renderer</h1>

[![Build status](https://badge.buildkite.com/6e35b17cae34535762b1a77b9dd64d24b53e84ed1fd9005ef1.svg?branch=master)](https://buildkite.com/tedshaughnessy/react-redux-test-renderer)

Extends and works with an existing `@test-library/react` installation

Simplifies the test setup of components using wrappers like Redux, React-Context and more.

<br>
</div>

## Installation

```
npm install --save-dev react-redux-test-renderer
```

To ensure everything plays nice, make sure you have the following dependancies already installed:

- `@testing-library/react`
- `react`
- `redux`
- `react-redux`

The package is tested against the versions listed in the `peerDependencies` section of the [package.json](package.json), it's flexible since it uses the package versions you're already using.

<br>

## Examples

### Rendering a Simple Component

```tsx
import { TestRenderer } from 'react-redux-test-renderer';

const testComponent = new TestRenderer(ReactComponent);

describe('test', () => {
    it('dispatches action when clicked', () => {
        // all the things you get from a test-libary render are also returned from this render
        const { getByTestId } = testComponent.render();

        const button = getByTestId('buttonId');
        fireEvent.click(button);

        const actions = testComponent.getCountForAllActions();
        const buttonAction = testComponent.getCountForAction('BUTTON_CLICKED');

        expect(actions.length).toBe(1);
        expect(buttonAction.length).toBe(1);
    });
});
```

### Passing Children

```tsx
it('renders children', () => {
    const children = [<p key="1">1</p>, <p key="2">2</p>];
    const { getByText } = testComponent.render(undefined, children);

    getByText('1');
    getByText('2');
});
```

### Setting Default Props

```tsx
const defaultProps = {
    toggled: true,
};

const testComponent = new TestRenderer(ReactComponent, defaultProps);

it('is toggled', () => {
    const { getByTestId } = testComponent.render();

    expect(getByTestId('toggleId')).toBe(toggled);
});

it('is not toggled', () => {
    const { getByTestId } = testComponent.render({ toggled: false });

    expect(getByTestId('toggleId')).not.toBe(toggled);
});
```

### Rendering with a Redux Store

```tsx
const defaultProps = {
    toggled: true,
};

const defaultState = {
    isSwitched: true,
};

const testComponent = new TestRenderer(ReactComponent, defaultProps, defaultState);

it('is switched', () => {
    // render using default props and default store
    const { getByTestId } = testComponent.renderWithStore();

    expect(getByTestId('switchId')).toBe(switchedOn);
});

it('is not switched', () => {
    // render using default props and a different state
    const { getByTestId } = testComponent.render(undefined, { isSwitched: false });

    // if props or state are set to undefined or null the default values will be used. Use and empty object {} to remove all props or state

    expect(getByTestId('switchId')).not.toBe(switchedOn);
});
```

### Updating the Redux Store (and triggering a render)

```tsx
it('updates switch when state changes', () => {
    // render using default props and default store
    const { getByTestId } = testComponent.renderWithStore();

    expect(getByTestId('switchId')).toBe(switchedOn);

    // this method dispatches an Action to trigger the render
    // it can be awaited, but doesn't usually need to be
    testComponent.updateStateWithDispatch({ ...defaultState, isSwitchedOn: false });

    expect(getByTestId('switchId')).not.toBe(switchedOn);
});
```

### Simpler Rerender

```tsx
it('needs to render again', () => {
    testComponent.render();

    // works like the usual rerender, just with fewer steps
    // (temporary wrappers are still used)
    const rerenderResult = result.rerender({ ...defaultProps });
});
```

### Wrappers

```tsx
const testComponent = new TestRenderer(ReactComponent, initialProps, initialState);
const routerId = testComponent.addWrapper(MemoryRouter, { initialEntries: ['/'] });
const contextId = testComponent.addContextProvider(Context, value);

describe('test', () => {
    it('wrapped', () => {
        // wrappers from top down: Redux -> ReactContext -> Router -> TestComponent
        const result = testComponent.renderWithStore();
    });
    it('routes to a page', () => {
        // when adding a wrapper an ID is returned. The ID can be used to change wrapper props/state before a render
        const result = testComponent
            .useWrapperProps(routerId, { initialEntries: [`/${route}/`] })
            .useContextValue(contextId, { somethingDifferent: true })
            .renderWithStore();

        await waitForElement(() => result.getByText('welcome to route'));
    });
    it('uses rerender and a temporary wrapper for an example', () => {
        // I'm not sure who asked for it but you can add a wrapper that only lasts for one render
        const result = testComponent.useTemporaryWrapper(Container, {}).renderWithStore();

        expect(something);
    });
});
```

- For further examples see the integration tests, happy testing :)
