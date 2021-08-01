import { TestRendererState } from '../TestRendererState';

export class StateMethods {
    private trs: TestRendererState;

    constructor(testRendererState: TestRendererState) {
        this.trs = testRendererState;
    }

    updateStateWithDispatch = (state: object, actionType?: string): void => {
        this.trs.setState(state);
        this.trs.mockStore.dispatch({ type: actionType ?? 'TESTING_UPDATE_ACTION' });
    };
}
