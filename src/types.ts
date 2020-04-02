import { RenderResult } from '@testing-library/react';
import { MockStore } from 'redux-mock-store';

export interface IWrapper {
    component: _component;
    props: object;
    type: 'component' | 'context' | 'provider';
}

type Override<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type TestRendererResult = Override<RenderResult, { rerender: (newProps: object) => void }>;
export type TestRendererResultWithStore = Override<TestRendererResult, { store: MockStore }>;
export type _component = any;
export type Action = { type: string; payload: any };
