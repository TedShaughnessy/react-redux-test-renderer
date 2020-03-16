import * as React from 'react';
import { _component } from './types';
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

        if (!this.isValidIndex(id)) {
            throw Error(
                `useWrapperProps 'id' is not valid, id is: ${id} ` +
                    `the wrapper array has a length of ${this.trb.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trb.temporaryWrappers;
        wrapperArray[id] = { wrapper: { ...wrapperArray[id].wrapper, props } };
    };

    useContextValue = (id: number, value: object): void => {
        this.enableTemporaryWrappers();

        if (!this.isValidIndex(id)) {
            throw Error(
                `useContextValue 'id' is not valid, id is: ${id} ` +
                    `the wrapper array has a length of ${this.trb.temporaryWrappers.length}`
            );
        }

        const wrapperArray = this.trb.temporaryWrappers;
        wrapperArray[id] = { wrapper: { ...wrapperArray[id].wrapper, value } };
    };

    private enableTemporaryWrappers = (): void => {
        if (!this.trb.useTemporaryWrappers) {
            this.trb.temporaryWrappers = [...this.trb.wrappers];
            this.trb.useTemporaryWrappers = true;
        }
    };

    private isValidIndex = (id: number): boolean => id >= 0 && id < this.trb.temporaryWrappers.length;
}
