import { TestRendererState } from '../TestRendererState';
import { Action } from '../types';

export class ActionMethods {
    private trs: TestRendererState;

    constructor(testRendererState: TestRendererState) {
        this.trs = testRendererState;
    }

    getAllActions = (): Action[] => this.trs.mockStore.getActions();

    getActionsOfType = (actionType: string): Action[] =>
        this.trs.mockStore.getActions().filter((action: Action) => action.type === actionType);

    getCountForAllActions = (): number => this.trs.mockStore.getActions().length;

    getCountForAction = (actionType: string): number =>
        this.trs.mockStore.getActions().filter((action: Action) => action.type === actionType).length;
}
