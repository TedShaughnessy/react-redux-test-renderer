import { TestRendererBase } from '../TestRendererBase';
import { Action } from '../types';

export class ActionMethods {
    private trb: TestRendererBase;

    constructor(testRendererBase: TestRendererBase) {
        this.trb = testRendererBase;
    }

    getAllActions = (): Action[] => this.trb.mockStore.getActions();

    getActionsOfType = (actionType: string): Action[] =>
        this.trb.mockStore.getActions().filter((action: Action) => action.type === actionType);

    getCountForAllActions = (): number => this.trb.mockStore.getActions().length;

    getCountForAction = (actionType: string): number =>
        this.trb.mockStore.getActions().filter((action: Action) => action.type === actionType).length;
}
