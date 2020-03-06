import { RenderResult } from '@testing-library/react';
import { MockStore } from 'redux-mock-store';

export interface IWrapper {
    wrapper: IComponent | IContextProvider;
}

export interface IComponent {
    component: _component;
    props: object;
}

export interface IContextProvider {
    context: React.Context<object>;
    value: object;
}

type Override<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export type TestRendererResult = Override<RenderResult, { rerender: (newProps: object) => void }>;
export type TestRendererResultWithStore = Override<TestRendererResult, { store: MockStore }>;
export type _component = any;
export type Action = { type: string; payload: any };
