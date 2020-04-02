import * as React from 'react';
import { _component } from './types';
import { TestRendererBase } from './TestRendererBase';

export class ComponentMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    addWrapper = (component: _component, props?: object): number => {
        this.trb.wrappers.push({ component, props: props ?? {}, type: 'component' });
        return this.trb.wrappers.length - 1;
    };

    addContextProvider = (context: React.Context<any>, value: object): number => {
        this.trb.wrappers.push({ component: context.Provider, props: { value }, type: 'context' });
        return this.trb.wrappers.length - 1;
    };

    addTemporaryWrapper = (component: _component, props: object): void => {
        this.createTemporaryWrappers();

        this.trb.temporaryWrappers.push({ component, props, type: 'component' });

        this.enableTemporaryWrappers();
    };

    useWrapperProps = (id: number, props: object): void => {
        this.createTemporaryWrappers();

        if (!this.isValidIndex(id)) {
            throw Error(
                `useWrapperProps 'id' is not valid, id is: ${id} ` +
                    `the wrapper array has a length of ${this.trb.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trb.temporaryWrappers;

        if (wrapperArray[id].type !== 'component') {
            throw Error(
                `useContextValue 'id' refers to a a type of '${wrapperArray[id].type}' not of type 'component'`
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
                    `the wrapper array has a length of ${this.trb.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trb.temporaryWrappers;

        if (wrapperArray[id].type !== 'context') {
            throw Error(`useContextValue 'id' refers to a a type of '${wrapperArray[id].type}' not of type 'context'`);
        }

        wrapperArray[id] = { ...wrapperArray[id], props: { value } };

        this.enableTemporaryWrappers();
    };

    private enableTemporaryWrappers = (): void => {
        this.trb.useTemporaryWrappers = true;
    };

    private createTemporaryWrappers = (): void => {
        if (!this.trb.useTemporaryWrappers) {
            this.trb.temporaryWrappers = [...this.trb.wrappers];
        }
    };

    private isValidIndex = (id: number): boolean => id >= 0 && id < this.trb.temporaryWrappers.length;
}
