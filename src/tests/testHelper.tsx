import {
    ITestMapStateToProps,
    ITestProps,
    propDifferentPassed,
    propPassed,
    statePropDifferentPassed,
    statePropFromStore,
} from './testComponents/TestComponent';

export const defaultProps: ITestProps = {
    prop: propPassed,
};
export const defaultState: ITestMapStateToProps = {
    stateProp: statePropFromStore,
};
export const differentProps: ITestProps = {
    prop: propDifferentPassed,
};
export const differentState: ITestMapStateToProps = {
    stateProp: statePropDifferentPassed,
};