# React-Redux-Test-Renderer

## Creating a TestRenderer

```typescript
const testComponent = new TestRenderer(
    ReactComponent,
    defaultProps,
    defaultState
);
```

- defaultProps and defaultState are optional
- adding wrappers and providers is also optional

```typescript
const wrapper = testComponent.addWrapper(TestWrapper, propsObject);
testComponent.addProvider(context, stateObject);
```

- when creating a wrapper, the wrapper returns a reference to itself

## Rendering

- use render() or renderWithStore() to render the testComponent
- both methods optionally take props and children that will override the default, the latter also takes state

```typescript
  const result = testComponent4
        .useWrapperProps(wrapper, { name: 'third-modified' })
        .addTemporaryWrapper(TestWrapper, {name: 'two'})
        .renderWithStore();
```

- useWrapperProps will change the props of an existing wrapper, using the reference from when it was created
- addTemporaryWrapper will add a wrapper for that render only

## Actions and Assertions

The render methods will return an object similar to RenderResult (but with rerender simplified) aswell as the store. The returned rerender method will function as expected and use any temporary wrappers and props.

Additional methods are available using the TestRenderer Object:

- getAllActions

- getActionsOfType

- getCountForAllActions

- getCountForAction

### See the tests for further examples of usage
