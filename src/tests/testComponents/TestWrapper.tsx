import * as React from 'react';

export const TestWrapper: React.FC<ITestWrapperProps> = props => {
    return <div className={props.name}>{props.children}</div>;
};

export interface ITestWrapperProps {
    name: string;
}
