export interface GuardError {
  readonly path: string;
  readonly expected: string;
  readonly actual: unknown;
  readonly message: string;
}

export interface ValidationSuccess<T> {
  readonly success: true;
  readonly value: T;
}

export interface ValidationFailure {
  readonly success: false;
  readonly errors: GuardError[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
export type InferGuard<T> = T extends Guard<infer U> ? U : never;
export interface Guard<T> {
  (value: unknown, path?: string): ValidationResult<T>;
  readonly typeName: string;
}
