/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import { TestContext } from './TestContextProviderWrapper';
import { propDefault } from './Properties';

export const TestContextConsumerComponent: React.FC<ITestProps> = props => {
    const context = React.useContext(TestContext);

    return (
        <>
            <h1>hello</h1>
            <h2>{props.prop}</h2>
            <h3>{context.contextProp}</h3>
        </>
    );
};

TestContextConsumerComponent.defaultProps = {
    prop: propDefault,
};

export interface ITestProps {
    prop?: string;
}
