import { TestRendererBase } from './TestRendererBase';
import { RenderMethods } from './RenderMethods';
import { ComponentMethods } from './ComponentMethods';
import { StateMethods } from './StateMethods';
import { ActionMethods } from './ActionMethods';

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
