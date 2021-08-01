import { TestRenderer } from 'react-redux-test-renderer';
import { defaultProps, defaultState } from './testHelper';
import ConnectedTestComponent from '../testComponents/TestComponent';
import { statePropDifferentPassed } from '../testComponents/Properties';

const connectedTestComponent = new TestRenderer(
    ConnectedTestComponent,
    defaultProps,
    defaultState
);

connectedTestComponent.renderWithStore(defaultProps, defaultState);
connectedTestComponent.updateStateWithDispatch({
    ...defaultState,
    stateProp: statePropDifferentPassed
});

describe('action functions works: ', () => {
    it('getAllActions', () => {
        expect(connectedTestComponent.getAllActions()).toEqual([
            { type: 'TESTING_UPDATE_ACTION' }
        ]);
    });
    it('getCountForAllActions', () => {
        expect(connectedTestComponent.getCountForAllActions()).toEqual(1);
    });
    it('getActionsOfType', () => {
        expect(
            connectedTestComponent.getActionsOfType('TESTING_UPDATE_ACTION')
        ).toEqual([{ type: 'TESTING_UPDATE_ACTION' }]);
    });
    it('getCountForAction', () => {
        expect(
            connectedTestComponent.getCountForAction('TESTING_UPDATE_ACTION')
        ).toEqual(1);
    });
    it('renderWithStore resets store when given new state', () => {
        connectedTestComponent.renderWithStore(defaultProps, defaultState);
        expect(connectedTestComponent.getCountForAllActions()).toEqual(0);
    });
    it('renderWithStore resets store when given no state', () => {
        connectedTestComponent.renderWithStore(defaultProps, defaultState);
        expect(connectedTestComponent.getCountForAllActions()).toEqual(0);
        connectedTestComponent.updateStateWithDispatch({});
        expect(connectedTestComponent.getCountForAllActions()).toEqual(1);
        connectedTestComponent.renderWithStore();
        expect(connectedTestComponent.getCountForAllActions()).toEqual(0);
    });
});
