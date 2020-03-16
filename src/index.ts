import { cleanup as RTLcleanup } from '@testing-library/react';
import { MethodFactory, Methods } from './MethodFactory';
import { _component, TestRendererResult, TestRendererResultWithStore, Action } from './types';

export const cleanup = RTLcleanup;

export class TestRenderer {
    private methods: Methods;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        const methodFactory = new MethodFactory(component, defaultProps, defaultState);
        this.methods = methodFactory.all;
    }

    /**
     * renders the test component
     * @param {object} props, if undefined will use default props
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    render = (props?: object, children?: _component): TestRendererResult => this.methods.render(props, children);

    /**
     * renders the test component with a redux store provider
     * @param {object} props, if undefined will use default props
     * @param {object} state, if undefined will use default state
     * @param {number} children, a react component of the test component children
     * @returns {TestRendererResult}
     */
    renderWithStore = (props?: object, state?: object, children?: _component): TestRendererResultWithStore =>
        this.methods.renderWithStore(props, state, children);

    /**
     * updates state and triggers state to be reflowed by dispatching an action of type TESTING_UPDATE_ACTION
     * is async to enable useEffect to detect state change
     * @param {object} state, the new state object for the redux store
     * @param {string} actionType, optional actionType to be used instead of TESTING_UPDATE_ACTION
     * @returns {Promise<void>}
     */
    updateStateWithDispatch = (state: object, actionType?: string): Promise<void> =>
        this.methods.updateStateWithDispatch(state, actionType);

    /**
     * wraps the existing test component and wrappers in another component
     * returns an id that can be used with useWrapperProps to update this wrappers props
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {number}
     */
    addWrapper = (component: _component, props?: object): number => this.methods.addWrapper(component, props);

    /**
     * wraps the existing test component and wrappers in a context provider
     * @param {React.Context<any>} context, the context to wrap the component and wrappers with
     * @param {object} value, the value of the context provider
     * @returns {number}
     */
    addContextProvider = (context: React.Context<any>, value: object): number =>
        this.methods.addContextProvider(context, value);

    /**
     * wraps the existing test component and wrappers in another component that only lasts for one render
     * returns the test component
     * @param {component} component, the wrapper component
     * @param {object} props, optional props for the wrapper
     * @returns {TestRenderer}
     */
    addTemporaryWrapper = (component: _component, props: object): TestRenderer => {
        this.methods.addTemporaryWrapper(component, props);
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
        this.methods.useWrapperProps(id, props);
        return this;
    };

    /**
     * change a context value for one render
     * returns the test component
     * @param {number} id, the wrappers id returned by addWrapper
     * @param {object} value, new value for the contextProvider
     * @returns {TestRenderer}
     */
    useContextValue = (id: number, value: object): TestRenderer => {
        this.methods.useContextValue(id, value);
        return this;
    };

    /**
     * get all of the actions dispatched since the last render
     * @returns {Action[]}
     */
    getAllActions = (): Action[] => this.methods.getAllActions();

    /**
     * get all of the actions dispatched since the last render of a particular type
     * @param {string} actionType
     * @returns {Action[]}
     */
    getActionsOfType = (actionType: string): Action[] => this.methods.getActionsOfType(actionType);

    /**
     * get the number of actions dispatched
     * @returns {number}
     */
    getCountForAllActions = (): number => this.methods.getCountForAllActions();

    /**
     * get the number of actions dispatched of a particular type
     * @returns {number}
     */
    getCountForAction = (actionType: string): number => this.methods.getCountForAction(actionType);
}
