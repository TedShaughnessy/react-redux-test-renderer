import configureStore, { MockStore } from 'redux-mock-store';
import { _component, IWrapper } from './types';

export class TestRendererState {
    state: object | undefined;

    mockStore: any;

    readonly component: _component;

    // eslint-disable-next-line react/static-property-placement
    readonly defaultProps: object = {};

    readonly defaultState: object = {};

    readonly middleware: any = [];

    wrappers: IWrapper[] = [];

    temporaryWrappers: IWrapper[] = [];

    useTemporaryWrappers: boolean = false;

    constructor(component: any, defaultProps?: object, defaultState?: object) {
        this.component = component;
        this.defaultProps = defaultProps || {};
        this.defaultState = defaultState || {};
        if (defaultState) {
            this.state = defaultState;
        }
        this.mockStore = configureStore(this.middleware);
    }

    // eslint-disable-next-line no-return-assign
    setStore(): MockStore {
        this.mockStore = configureStore(this.middleware)(() => this.state);
        return this.mockStore;
    }

    setState(state?: object): object {
        this.state = state !== undefined ? state : this.defaultState;
        return this.state;
    }
}
