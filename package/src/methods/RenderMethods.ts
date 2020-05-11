import { createElement, ReactNode } from 'react';
import { render as RTLrender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { _component, TestRendererResult, TestRendererResultWithStore, IWrapper } from '../types';
import { TestRendererBase } from '../TestRendererBase';

export class RenderMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    render = (props?: object, children?: ReactNode[]): TestRendererResult => {
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

    renderWithStore = (props?: object, state?: object, children?: ReactNode[]): TestRendererResultWithStore => {
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

    private buildComponent = (props?: object, children?: ReactNode[]): _component => {
        const component = this.createBaseComponent(props, children);

        if (this.trb.useTemporaryWrappers) {
            this.trb.useTemporaryWrappers = false;
            return this.wrapWithWrapperArray(this.trb.temporaryWrappers, component);
        }

        return this.wrapWithWrapperArray(this.trb.wrappers, component);
    };

    private wrapWithWrapperArray = (array: IWrapper[], component: _component): _component => {
        let wrappedElement = component;

        array.forEach(wrapper => {
            wrappedElement = this.wrapWithWrapper(wrappedElement, wrapper);
        });

        return wrappedElement;
    };

    private wrapWithWrapper = (component: _component, wrapper: IWrapper): _component =>
        createElement(wrapper.component, { ...wrapper.props }, component);

    private wrapWithProvider = (store: any, childComponent: ReactNode): _component =>
        this.wrapWithWrapper(childComponent, { component: Provider, props: { store }, type: 'provider' });

    private createBaseComponent = (props?: object, children: ReactNode[] = []): _component =>
        createElement(this.trb.component, props || this.trb.defaultProps, ...children);
}
