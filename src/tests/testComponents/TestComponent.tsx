/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { connect } from 'react-redux';

export const statePropFromStore = 'statePropFromStore';
export const statePropDefault = 'statePropDefault';
export const statePropDifferentPassed = 'statePropDifferentPassed';

export const propPassed = 'propPassed';
export const propDefault = 'propDefault';
export const propDifferentPassed = 'propDifferentPassed';

type IProps = ITestProps & ITestMapStateToProps;

export const TestComponent: React.FC<IProps> = props => {
    return (
        <>
            <h1>hello</h1>
            <h2>{props.prop}</h2>
            <h3>{props.stateProp}</h3>
        </>
    );
};

TestComponent.defaultProps = {
    prop: propDefault,
    stateProp: statePropDefault,
};

export interface ITestProps {
    prop?: string;
    stateProp?: string;
}

export interface ITestMapStateToProps {
    stateProp?: string;
}

const mapStateToProps = (state: ITestMapStateToProps) => ({
    stateProp: state.stateProp,
});

export default connect(mapStateToProps)(TestComponent);
