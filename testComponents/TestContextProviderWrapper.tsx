/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import * as React from 'react';

interface IContextState {
    contextProp: number;
}

export const defaultContextState: IContextState = { contextProp: 0 };

export const TestContext = React.createContext<IContextState>(defaultContextState);

export const TestContextProviderWrapper: React.FC<ITestWrapperProps> = props => {
    return <TestContext.Provider value={defaultContextState}>{props.children}</TestContext.Provider>;
};

export interface ITestWrapperProps {
    name: string;
}
