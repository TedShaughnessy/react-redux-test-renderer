import { TestRendererState } from './TestRendererState';
import { RenderMethods } from './methods/RenderMethods';
import { ComponentMethods } from './methods/ComponentMethods';
import { StateMethods } from './methods/StateMethods';
import { ActionMethods } from './methods/ActionMethods';

type PublicMethods<T> = { [K in keyof T]: T[K] };
export type Methods = PublicMethods<RenderMethods> &
    PublicMethods<ComponentMethods> &
    PublicMethods<StateMethods> &
    PublicMethods<ActionMethods>;

export class MethodFactory {
    all: Methods;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        const testRendererState = new TestRendererState(component, defaultProps, defaultState);

        this.all = {
            ...new ActionMethods(testRendererState),
            ...new StateMethods(testRendererState),
            ...new ComponentMethods(testRendererState),
            ...new RenderMethods(testRendererState),
        };
    }
}
