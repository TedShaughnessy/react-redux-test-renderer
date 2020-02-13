import { cleanup as RTLcleanup, render as RTLrender, RenderResult } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore, { MockStore } from 'redux-mock-store';
import { wait } from '@testing-library/dom';

export const cleanup = (): void => RTLcleanup();

export class TestRenderer {
    private state: object | undefined;

    private mockStore: any;

    private readonly component: component;

    // eslint-disable-next-line react/static-property-placement
    private readonly defaultProps: object = {};

    private readonly defaultState: object = {};

    private readonly middleware: any = [];

    private wrappers: IWrapper[] = [];

    private temporaryWrappers: IWrapper[] = [];

    private useTemporaryWrappers: boolean = false;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        this.component = component;
        this.defaultProps = defaultProps || {};
        this.defaultState = defaultState || {};
        if (defaultState) {
            this.state = defaultState;
        }
        this.mockStore = configureStore(this.middleware);
    }

    /**
     * renders the test component
     * @param {object} props, if undefined will use default props
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    render(props?: object, children?: component): TestRendererResult {
        const usingTemporaryWrappers = this.useTemporaryWrappers;
        const renderResult = RTLrender(this.buildComponent(props, children));

        return {
            ...renderResult,
            rerender: (newProps: object): void => {
                this.useTemporaryWrappers = usingTemporaryWrappers;
                renderResult.rerender(this.buildComponent(newProps, children));
            },
        };
    }

    /**
     * renders the test component with a redux store provider
     * @param {object} props, if undefined will use default props
     * @param {object} state, if undefined will use default state
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    renderWithStore(props?: object, state?: object, children?: component): TestRendererResultWithStore {
        this.setState(state);
        const store = this.setStore();
        const usingTemporaryWrappers = this.useTemporaryWrappers;

        const wrappedComponent = this.wrapWithProvider(store, this.buildComponent(props, children));

        const renderResult = RTLrender(wrappedComponent);

        return {
            ...renderResult,
            store,
            rerender: (newProps: object): void => {
                this.useTemporaryWrappers = usingTemporaryWrappers;
                return renderResult.rerender(this.wrapWithProvider(store, this.buildComponent(newProps, children)));
            },
        };
    }

    /**
     * updates state and triggers state to be reflowed by dispatching an action of type TESTING_UPDATE_ACTION
     * is async to enable useEffect to detect state change
     * @param {object} state, the new state object for the redux store
     * @param {string} actionType, optional actionType to be used instead of TESTING_UPDATE_ACTION
     * @returns {Promise<void>}
     */
    async updateStateWithDispatch(state: object, actionType?: string): Promise<void> {
        this.setState(state);
        this.mockStore.dispatch({ type: actionType ?? 'TESTING_UPDATE_ACTION' });
        await wait(undefined, { interval: 1 });
    }

    /**
     * wraps the existing test component and wrappers in another component
     * returns an id that can be used with useWrapperProps to update this wrappers props
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {number}
     */
    addWrapper = (component: component, props?: object): number => {
        this.wrappers.push({ wrapper: { component, props: props ?? {} } });
        return this.wrappers.length - 1;
    };

    /**
     * wraps the existing test component and wrappers in a context provider
     * @param {React.Context<any>} context, the context to wrap the component and wrappers with
     * @param {object} value, the value of the context provider
     * @returns {number}
     */
    addContextProvider = (context: React.Context<any>, value: object): number => {
        this.wrappers.push({ wrapper: { context, value } });
        return this.wrappers.length - 1;
    };

    /**
     * wraps the existing test component and wrappers in another component that only lasts for one render
     * returns the test component
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {TestRenderer}
     */
    addTemporaryWrapper = (component: component, props: object): TestRenderer => {
        if (!this.useTemporaryWrappers) {
            this.temporaryWrappers = [...this.wrappers];
            this.useTemporaryWrappers = true;
        }

        this.temporaryWrappers.push({ wrapper: { component, props } });
        return this;
    };

    /**
     * change a wrappers props for one render
     * returns the test component
     * @param {number} id, the wrappers id returned by addWrapper
     * @param {object} props, new props for the wrapper
     * @returns {TestRenderer}
     */
    useWrapperProps = (id: number, props: object): TestRenderer => {
        if (!this.useTemporaryWrappers) {
            this.temporaryWrappers = [...this.wrappers];
            this.useTemporaryWrappers = true;
        }

        this.modifyWrapperPropsArray(this.temporaryWrappers, id, props);

        return this;
    };

    /**
     * get all of the actions dispatched since the last render
     * @returns {action[]}
     */
    getAllActions = (): action[] => this.mockStore.getActions();

    /**
     * get all of the actions dispatched since the last render of a particular type
     * @param {string} actionType
     * @returns {action[]}
     */
    getActionsOfType = (actionType: string): action[] =>
        this.mockStore.getActions().filter((action: action) => action.type === actionType);

    /**
     * get the number of actions dispatched
     * @returns {action[]}
     */
    getCountForAllActions = (): number => this.mockStore.getActions().length;

    /**
     * get the number of actions dispatched of a particular type
     * @returns {action[]}
     */
    getCountForAction = (actionType: string): number =>
        this.mockStore.getActions().filter((action: action) => action.type === actionType).length;

    private buildComponent = (props?: object, children?: component): component => {
        const component = this.createBaseComponent(props, children);

        if (this.useTemporaryWrappers) {
            this.useTemporaryWrappers = false;
            return this.wrapWithTemporaryWrappers(component);
        }

        return this.wrapWithWrappers(component);
    };

    private modifyWrapperPropsArray = (array: IWrapper[], index: number, props: object): component => {
        const wrapper = array[index].wrapper as IComponent;

        if (wrapper.component === undefined) {
            throw new Error('not a component');
        }

        // eslint-disable-next-line no-param-reassign
        array[index] = { wrapper: { component: wrapper.component, props } };
    };

    private wrapWithWrappers = (component: component): component => this.wrapWithWrapperArray(this.wrappers, component);

    private wrapWithTemporaryWrappers = (component: component): component =>
        this.wrapWithWrapperArray(this.temporaryWrappers, component);

    private wrapWithWrapperArray = (array: IWrapper[], component: component): component => {
        array.forEach(wrapper => {
            // eslint-disable-next-line no-param-reassign
            component =
                (wrapper.wrapper as IComponent).component !== undefined
                    ? this.wrapWithWrapper(component, wrapper.wrapper as IComponent)
                    : this.wrapWithContextProvider(component, wrapper.wrapper as IContextProvider);
        });
        return component;
    };

    private wrapWithWrapper = (component: component, wrapper: IComponent): component =>
        // eslint-disable-next-line react/no-children-prop
        React.createElement(wrapper.component, { ...wrapper.props, children: component });

    private wrapWithProvider = (store: any, childComponent: component): component => (
        <Provider store={store}>{childComponent}</Provider>
    );

    private wrapWithContextProvider = (childComponent: component, wrapper: IContextProvider): component => (
        <wrapper.context.Provider value={wrapper.value}>{childComponent}</wrapper.context.Provider>
    );

    private createBaseComponent = (props?: object, children?: component): component =>
        React.createElement(this.component, props || this.defaultProps, children);

    // eslint-disable-next-line no-return-assign
    private setStore(): MockStore {
        this.mockStore = configureStore(this.middleware)(() => this.state);
        return this.mockStore;
    }

    private setState(state?: object): object {
        this.state = state !== undefined ? state : this.defaultState;
        return this.state;
    }
}

interface IWrapper {
    wrapper: IComponent | IContextProvider;
}

interface IComponent {
    component: component;
    props: object;
}

interface IContextProvider {
    context: React.Context<object>;
    value: object;
}

type Override<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type TestRendererResult = Override<RenderResult, { rerender: (newProps: object) => void }>;
type TestRendererResultWithStore = Override<TestRendererResult, { store: MockStore }>;
type action = { type: string };
type component = any;
