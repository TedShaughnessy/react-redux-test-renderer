import React from 'react';
import { _component, IWrapper, IComponent } from './types';
import { TestRendererBase } from './TestRendererBase';

export class ComponentMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    addWrapper = (component: _component, props?: object): number => {
        this.trb.wrappers.push({ wrapper: { component, props: props ?? {} } });
        return this.trb.wrappers.length - 1;
    };

    /**
     * wraps the existing test component and wrappers in a context provider
     * @param {React.Context<any>} context, the context to wrap the component and wrappers with
     * @param {object} value, the value of the context provider
     * @returns {number}
     */
    addContextProvider = (context: React.Context<any>, value: object): number => {
        this.trb.wrappers.push({ wrapper: { context, value } });
        return this.trb.wrappers.length - 1;
    };

    /**
     * wraps the existing test component and wrappers in another component that only lasts for one render
     * returns the test component
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {TestRenderer}
     */
    addTemporaryWrapper = (component: _component, props: object): void => {
        if (!this.trb.useTemporaryWrappers) {
            this.trb.temporaryWrappers = [...this.trb.wrappers];
            this.trb.useTemporaryWrappers = true;
        }

        this.trb.temporaryWrappers.push({ wrapper: { component, props } });
    };

    useWrapperProps = (id: number, props: object): void => {
        if (!this.trb.useTemporaryWrappers) {
            this.trb.temporaryWrappers = [...this.trb.wrappers];
            this.trb.useTemporaryWrappers = true;
        }

        this.modifyWrapperPropsArray(this.trb.temporaryWrappers, id, props);
    };

    private modifyWrapperPropsArray = (array: IWrapper[], index: number, props: object): _component => {
        const wrapper = array[index].wrapper as IComponent;

        if (wrapper.component === undefined) {
            throw new Error('not a component');
        }

        // eslint-disable-next-line no-param-reassign
        array[index] = { wrapper: { component: wrapper.component, props } };
    };
}
