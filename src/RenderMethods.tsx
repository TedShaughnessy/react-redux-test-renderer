import { render as RTLrender } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import {
    _component,
    TestRendererResult,
    TestRendererResultWithStore,
    IWrapper,
    IComponent,
    IContextProvider,
} from './types';
import { TestRendererBase } from './TestRendererBase';

export class RenderMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    render = (props?: object, children?: _component): TestRendererResult => {
        const usingTemporaryWrappers = this.trb.useTemporaryWrappers;
        const renderResult = RTLrender(this.buildComponent(props, children));

        return {
            ...renderResult,
            rerender: (newProps: object): void => {
                this.trb.useTemporaryWrappers = usingTemporaryWrappers;
                renderResult.rerender(this.buildComponent(newProps, children));
            },
        };
    };

    renderWithStore = (props?: object, state?: object, children?: _component): TestRendererResultWithStore => {
        this.trb.setState(state);
        const store = this.trb.setStore();
        const usingTemporaryWrappers = this.trb.useTemporaryWrappers;

        const wrappedComponent = this.wrapWithProvider(store, this.buildComponent(props, children));

        const renderResult = RTLrender(wrappedComponent);

        return {
            ...renderResult,
            store,
            rerender: (newProps: object): void => {
                this.trb.useTemporaryWrappers = usingTemporaryWrappers;
                return renderResult.rerender(this.wrapWithProvider(store, this.buildComponent(newProps, children)));
            },
        };
    };

    private buildComponent = (props?: object, children?: _component): _component => {
        const component = this.createBaseComponent(props, children);

        if (this.trb.useTemporaryWrappers) {
            this.trb.useTemporaryWrappers = false;
            return this.wrapWithTemporaryWrappers(component);
        }

        return this.wrapWithWrappers(component);
    };

    private wrapWithWrappers = (component: _component): _component =>
        this.wrapWithWrapperArray(this.trb.wrappers, component);

    private wrapWithTemporaryWrappers = (component: _component): _component =>
        this.wrapWithWrapperArray(this.trb.temporaryWrappers, component);

    private wrapWithWrapperArray = (array: IWrapper[], component: _component): _component => {
        let wrappedElement = component;

        array.forEach(wrapper => {
            wrappedElement =
                (wrapper.wrapper as IComponent).component !== undefined
                    ? this.wrapWithWrapper(wrappedElement, wrapper.wrapper as IComponent)
                    : this.wrapWithContextProvider(wrappedElement, wrapper.wrapper as IContextProvider);
        });

        return wrappedElement;
    };

    private wrapWithWrapper = (component: _component, wrapper: IComponent): _component =>
        React.createElement(wrapper.component, { ...wrapper.props }, component);

    private wrapWithProvider = (store: any, childComponent: _component): _component => (
        <Provider store={store}>{childComponent}</Provider>
    );

    private wrapWithContextProvider = (childComponent: _component, wrapper: IContextProvider): _component => (
        <wrapper.context.Provider value={wrapper.value}>{childComponent}</wrapper.context.Provider>
    );

    private createBaseComponent = (props?: object, children?: _component): _component =>
        React.createElement(this.trb.component, props || this.trb.defaultProps, children);
}
