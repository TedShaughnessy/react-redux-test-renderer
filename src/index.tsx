import { cleanup as RTLcleanup, render as RTLrender, RenderResult } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import configureStore, { MockStore } from 'redux-mock-store';

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

    updateStateWithDispatch(state: object): void {
        this.setState(state);
        this.mockStore.dispatch({ type: 'TESTING_UPDATE_ACTION' });
    }

    addWrapper = (component: component, props: object): number => {
        this.wrappers.push({ component, props });
        return this.wrappers.length - 1;
    };

    addTemporaryWrapper = (component: component, props: object): TestRenderer => {
        if (!this.useTemporaryWrappers) {
            this.temporaryWrappers = [...this.wrappers];
            this.useTemporaryWrappers = true;
        }

        this.temporaryWrappers.push({ component, props });
        return this;
    };

    useWrapperProps = (index: number, props: object): TestRenderer => {
        if (!this.useTemporaryWrappers) {
            this.temporaryWrappers = [...this.wrappers];
            this.useTemporaryWrappers = true;
        }

        this.modifyWrapperPropsArray(this.temporaryWrappers, index, props);

        return this;
    };

    getAllActions = (): action[] => this.mockStore.getActions();

    getActionsOfType = (actionType: string): action[] =>
        this.mockStore.getActions().filter((action: action) => action.type === actionType);

    getCountForAllActions = (): number => this.mockStore.getActions().length;

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
        // eslint-disable-next-line no-param-reassign
        array[index] = { component: this.wrappers[index].component, props };
    };

    private wrapWithWrappers = (component: component): component => this.wrapWithWrapperArray(this.wrappers, component);

    private wrapWithTemporaryWrappers = (component: component): component =>
        this.wrapWithWrapperArray(this.temporaryWrappers, component);

    private wrapWithWrapperArray = (array: IWrapper[], component: component): component => {
        array.forEach(wrapper => {
            // eslint-disable-next-line no-param-reassign
            component = this.wrapWithWrapper(component, wrapper);
        });
        return component;
    };

    private wrapWithWrapper = (component: component, wrapper: IWrapper): component =>
        // eslint-disable-next-line react/no-children-prop
        React.createElement(wrapper.component, { ...wrapper.props, children: component });

    private wrapWithProvider = (store: any, childComponent: component): component => (
        <Provider store={store}>{childComponent}</Provider>
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
    component: component;
    props: object;
}

type Override<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type TestRendererResult = Override<RenderResult, { rerender: (newProps: object) => void }>;
type TestRendererResultWithStore = Override<TestRendererResult, { store: MockStore }>;
type action = { type: string };
type component = any;
