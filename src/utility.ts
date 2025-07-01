import type { Guard, GuardWithErrors } from "./types";

export const ERROR_TAG = "GUARD_FAIL:";

export function assertType<K extends keyof (CheckableTypes & CheckablePrimitives)>(
  value: unknown,
  typeName: K,
  extraMessage = `got '${typeOf(value)}'`
): value is (CheckableTypes & CheckablePrimitives)[K] {
  const passed = typeIs(value, typeName);
  if (passed) return true;

  throw ERROR_TAG + `Expected '${typeName}'` + (extraMessage !== undefined ? ", " + extraMessage : "");
}

export function assertLiteral<T>(
  value: unknown,
  expected: T,
  extraMessage = `got '${value}'`
): value is T {
  const passed = value === expected;
  if (passed) return true;

  throw ERROR_TAG + `Expected literal '${expected}'` + (extraMessage !== undefined ? ", " + extraMessage : "");
}

export function wrap<T>(guard: Guard<T>): GuardWithErrors<T> {
  return ((value: unknown) => {
    let capturedErr = "";
    return $tuple(xpcall(guard, err => {
      const message = tostring(err);
      const [_, tagEnd] = message.find(ERROR_TAG);
      if (tagEnd === undefined)
        throw err;

      capturedErr = message.sub(tagEnd + 1);
    }, value)[0], capturedErr);
  }) as never;
}