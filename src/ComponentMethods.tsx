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

    addContextProvider = (context: React.Context<any>, value: object): number => {
        this.trb.wrappers.push({ wrapper: { context, value } });
        return this.trb.wrappers.length - 1;
    };

    addTemporaryWrapper = (component: _component, props: object): void => {
        this.enableTemporaryWrappers();

        this.trb.temporaryWrappers.push({ wrapper: { component, props } });
    };

    useWrapperProps = (id: number, props: object): void => {
        this.enableTemporaryWrappers();

        this.modifyWrapperPropsArray(this.trb.temporaryWrappers, id, props);
    };

    useContextValue = (id: number, props: object): void => this.useWrapperProps(id, props);

    private enableTemporaryWrappers = (): void => {
        if (!this.trb.useTemporaryWrappers) {
            this.trb.temporaryWrappers = [...this.trb.wrappers];
            this.trb.useTemporaryWrappers = true;
        }
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
