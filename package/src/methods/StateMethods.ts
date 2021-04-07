import { TestRendererState } from '../TestRendererState';

export class StateMethods {
    private trs: TestRendererState;

    constructor(testRendererState: TestRendererState) {
        this.trs = testRendererState;
    }

    updateStateWithDispatch = async (state: object, actionType?: string): Promise<void> => {
        this.trs.setState(state);
        this.trs.mockStore.dispatch({ type: actionType ?? 'TESTING_UPDATE_ACTION' });
        // asynchronous function allows react to run useEffects
        await new Promise(_ => setTimeout(() => {}, 1));
    };
}
