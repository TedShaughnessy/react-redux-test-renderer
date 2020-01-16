import { RenderResult } from '@testing-library/react';
import { ITestMapStateToProps, ITestProps } from './testComponents/TestComponent';
import {
    propPassed,
    statePropFromStore,
    propDifferentPassed,
    statePropDifferentPassed,
} from './testComponents/Properties';

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

export const getNullSafeTextContent = (result: RenderResult, selector: string): string => {
    if (result && result.baseElement && result.baseElement.querySelector(selector)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return result.baseElement.querySelector(selector)!.textContent || '';
    }
    return '';
};

export const propSelector = 'h2';
export const statePropSelector = 'h3';
