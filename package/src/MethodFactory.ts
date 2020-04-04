import { TestRendererBase } from './TestRendererBase';
import { RenderMethods } from './methods/RenderMethods';
import { ComponentMethods } from './methods/ComponentMethods';
import { StateMethods } from './methods/StateMethods';
import { ActionMethods } from './methods/ActionMethods';

type PublicMethods<T> = { [K in keyof T]: T[K] };
export type Methods = PublicMethods<RenderMethods & ComponentMethods & StateMethods & ActionMethods>;

export class MethodFactory {
    all: Methods;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        const testRendererBase = new TestRendererBase(component, defaultProps, defaultState);

        this.all = {
            ...new ActionMethods(testRendererBase),
            ...new StateMethods(testRendererBase),
            ...new ComponentMethods(testRendererBase),
            ...new RenderMethods(testRendererBase),
        };
    }
}
