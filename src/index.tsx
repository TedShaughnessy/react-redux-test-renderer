import { cleanup as RTLcleanup } from '@testing-library/react';
import { TestRendererBase } from './TestRendererBase';
import { RenderMethods } from './RenderMethods';
import { ComponentMethods } from './ComponentMethods';
import { StateMethods } from './StateMethods';
import { ActionMethods } from './ActionMethods';
import { QueryMethods } from './QueryMethods';
import { _component, TestRendererResult, TestRendererResultWithStore, Action } from './types';

export const cleanup = RTLcleanup;

export class TestRenderer {
    private testRendererBase: TestRendererBase;

    private renderMethods: RenderMethods;

    private componentMethods: ComponentMethods;

    private stateMethods: StateMethods;

    private actionMethods: ActionMethods;

    private queryMethods: QueryMethods;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        this.testRendererBase = new TestRendererBase(component, defaultProps, defaultState);
        this.renderMethods = new RenderMethods(this.testRendererBase);
        this.componentMethods = new ComponentMethods(this.testRendererBase);
        this.stateMethods = new StateMethods(this.testRendererBase);
        this.actionMethods = new ActionMethods(this.testRendererBase);
        this.queryMethods = new QueryMethods(this.testRendererBase);
    }

    /**
     * renders the test component
     * @param {object} props, if undefined will use default props
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    render = (props?: object, children?: _component): TestRendererResult => this.renderMethods.render(props, children);

    /**
     * renders the test component with a redux store provider
     * @param {object} props, if undefined will use default props
     * @param {object} state, if undefined will use default state
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    renderWithStore = (props?: object, state?: object, children?: _component): TestRendererResultWithStore =>
        this.renderMethods.renderWithStore(props, state, children);

    /**
     * updates state and triggers state to be reflowed by dispatching an action of type TESTING_UPDATE_ACTION
     * is async to enable useEffect to detect state change
     * @param {object} state, the new state object for the redux store
     * @param {string} actionType, optional actionType to be used instead of TESTING_UPDATE_ACTION
     * @returns {Promise<void>}
     */
    updateStateWithDispatch = (state: object, actionType?: string): Promise<void> =>
        this.stateMethods.updateStateWithDispatch(state, actionType);

    /**
     * wraps the existing test component and wrappers in another component
     * returns an id that can be used with useWrapperProps to update this wrappers props
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {number}
     */
    addWrapper = (component: _component, props?: object): number => this.componentMethods.addWrapper(component, props);

    /**
     * wraps the existing test component and wrappers in a context provider
     * @param {React.Context<any>} context, the context to wrap the component and wrappers with
     * @param {object} value, the value of the context provider
     * @returns {number}
     */
    addContextProvider = (context: React.Context<any>, value: object): number =>
        this.componentMethods.addContextProvider(context, value);

    /**
     * wraps the existing test component and wrappers in another component that only lasts for one render
     * returns the test component
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {TestRenderer}
     */
    addTemporaryWrapper = (component: _component, props: object): TestRenderer => {
        this.componentMethods.addTemporaryWrapper(component, props);
        return this;
    };

    /**
     * change a wrappers props for one render
     * returns the test component
     * @param {number} id, the wrappers id returned by addWrapper
     * @param {object} props, new props for the wrapper
     * @returns {TestRenderer}
     */
    useWrapperProps = (id: number, props: object): TestRenderer => {
        this.componentMethods.useWrapperProps(id, props);
        return this;
    };

    /**
     * get all of the actions dispatched since the last render
     * @returns {Action[]}
     */
    getAllActions = (): Action[] => this.actionMethods.getAllActions();

    /**
     * get all of the actions dispatched since the last render of a particular type
     * @param {string} actionType
     * @returns {Action[]}
     */
    getActionsOfType = (actionType: string): Action[] => this.actionMethods.getActionsOfType(actionType);

    /**
     * get the number of actions dispatched
     * @returns {action[]}
     */
    getCountForAllActions = (): number => this.actionMethods.getCountForAllActions();

    /**
     * get the number of actions dispatched of a particular type
     * @returns {action[]}
     */
    getCountForAction = (actionType: string): number => this.actionMethods.getCountForAction(actionType);
}
