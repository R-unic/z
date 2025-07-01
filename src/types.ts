export type GuardWithErrors<T> = { _for_type: T } & ((value: unknown) => LuaTuple<[boolean, string]>);
export type InferGuard<T> = T extends { _for_type: infer U } ? U : T extends Guard<infer U> ? U : never;
export type Guard<T> = (value: unknown) => value is T;