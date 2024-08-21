export interface Message<T> {
    correlationId: string;
    payload: T;
}
export type AwaitingResponse<T> = Record<string, {
    resolve: (value: T) => void;
    reject: (reason: unknown) => void;
}>;
