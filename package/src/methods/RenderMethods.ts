import { createElement, ReactNode } from 'react';
import { render as RTLrender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { _component, TestRendererResult, TestRendererResultWithStore, IWrapper } from '../types';
import { TestRendererState } from '../TestRendererState';

export class RenderMethods {
    private trs: TestRendererState;

    constructor(testRendererState: TestRendererState) {
        this.trs = testRendererState;
    }

    render = (props?: object, children?: ReactNode[]): TestRendererResult => {
        const usingTemporaryWrappers = this.trs.useTemporaryWrappers;
        const renderResult = RTLrender(this.buildComponent(props, children));

        return {
            ...renderResult,
            rerender: (newProps: object): void => {
                this.trs.useTemporaryWrappers = usingTemporaryWrappers;
                renderResult.rerender(this.buildComponent(newProps, children));
            },
        };
    };

    renderWithStore = (props?: object, state?: object, children?: ReactNode[]): TestRendererResultWithStore => {
        this.trs.setState(state);
        const store = this.trs.setStore();
        const usingTemporaryWrappers = this.trs.useTemporaryWrappers;

        const wrappedComponent = this.wrapWithProvider(store, this.buildComponent(props, children));

        const renderResult = RTLrender(wrappedComponent);

        return {
            ...renderResult,
            store,
            rerender: (newProps: object): void => {
                this.trs.useTemporaryWrappers = usingTemporaryWrappers;
                return renderResult.rerender(this.wrapWithProvider(store, this.buildComponent(newProps, children)));
            },
        };
    };

    private buildComponent = (props?: object, children?: ReactNode[]): _component => {
        const component = this.createBaseComponent(props, children);

        if (this.trs.useTemporaryWrappers) {
            this.trs.useTemporaryWrappers = false;
            return this.wrapWithWrapperArray(this.trs.temporaryWrappers, component);
        }

        return this.wrapWithWrapperArray(this.trs.wrappers, component);
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
        createElement(this.trs.component, props || this.trs.defaultProps, ...children);
}
