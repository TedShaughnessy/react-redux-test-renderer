import { TestRendererBase } from '../TestRendererBase';

export class StateMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    updateStateWithDispatch = async (state: object, actionType?: string): Promise<void> => {
        this.trb.setState(state);
        this.trb.mockStore.dispatch({ type: actionType ?? 'TESTING_UPDATE_ACTION' });
        // asynchronous function allows react to run useEffects
        await new Promise(_ => setTimeout(() => {}, 1));
    };
}
