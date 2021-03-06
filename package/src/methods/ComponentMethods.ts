import * as React from 'react';
import { _component } from '../types';
import { TestRendererState } from '../TestRendererState';

export class ComponentMethods {
    private trs: TestRendererState;

    constructor(testRendererState: TestRendererState) {
        this.trs = testRendererState;
    }

    addWrapper = (component: _component, props?: object): number => {
        this.trs.wrappers.push({ component, props: props ?? {}, type: 'component' });
        return this.trs.wrappers.length - 1;
    };

    addContextProvider = (context: React.Context<any>, value: object): number => {
        this.trs.wrappers.push({ component: context.Provider, props: { value }, type: 'context' });
        return this.trs.wrappers.length - 1;
    };

    addTemporaryWrapper = (component: _component, props: object): void => {
        this.createTemporaryWrappers();

        this.trs.temporaryWrappers.push({ component, props, type: 'component' });

        this.enableTemporaryWrappers();
    };

    useWrapperProps = (id: number, props: object): void => {
        this.createTemporaryWrappers();

        if (!this.isValidIndex(id)) {
            throw Error(
                `useWrapperProps 'id' is not valid, id is: ${id} ` +
                    `the wrapper array has a length of ${this.trs.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trs.temporaryWrappers;

        if (wrapperArray[id].type !== 'component') {
            throw Error(
                `useWrapperprops 'id' refers to a a type of '${wrapperArray[id].type}' not of type 'component'`
            );
        }

        wrapperArray[id] = { ...wrapperArray[id], props };

        this.enableTemporaryWrappers();
    };

    useContextValue = (id: number, value: object): void => {
        this.createTemporaryWrappers();

        if (!this.isValidIndex(id)) {
            throw Error(
                `useContextValue 'id' is not valid, id is: ${id} ` +
                    `the wrapper array has a length of ${this.trs.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trs.temporaryWrappers;

        if (wrapperArray[id].type !== 'context') {
            throw Error(`useContextValue 'id' refers to a a type of '${wrapperArray[id].type}' not of type 'context'`);
        }

        wrapperArray[id] = { ...wrapperArray[id], props: { value } };

        this.enableTemporaryWrappers();
    };

    private enableTemporaryWrappers = (): void => {
        this.trs.useTemporaryWrappers = true;
    };

    private createTemporaryWrappers = (): void => {
        if (!this.trs.useTemporaryWrappers) {
            this.trs.temporaryWrappers = [...this.trs.wrappers];
        }
    };

    private isValidIndex = (id: number): boolean => id >= 0 && id < this.trs.temporaryWrappers.length;
}
