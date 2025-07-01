import { GuardWithErrors, InferGuard } from "./types";
import { ERROR_TAG, assertLiteral, assertType, wrap } from "./utility";

const z = {
  boolean(): GuardWithErrors<boolean> {
    return wrap(v => assertType(v, "boolean"));
  },

  string(): GuardWithErrors<string> {
    return wrap(v => assertType(v, "string"));
  },

  number(): GuardWithErrors<number> {
    return wrap(v => assertType(v, "number"));
  },

  nil(): GuardWithErrors<undefined> {
    return wrap(v => assertType(v, "nil"));
  },

  literal<T extends string | number | boolean>(expected: T): GuardWithErrors<T> {
    return wrap(v => assertLiteral<T>(v, expected));
  },

  union<Guards extends GuardWithErrors<unknown>[]>(...guards: Guards): GuardWithErrors<InferGuard<Guards[number]>> {
    return wrap((v): v is InferGuard<Guards[number]> => {
      let unionPassed = false;
      const unionErrors: string[] = [];
      for (const guard of guards) {
        const [success, passed, err] = pcall(guard, v);
        if (success && passed) {
          unionPassed = true;
          break;
        }

        unionErrors.push(err!);
      }

      if (!unionPassed)
        throw ERROR_TAG + `Union member:\n` + unionErrors.join("\nOR ") + "\n";

      return unionPassed;
    });
  },

  intersection<Guards extends GuardWithErrors<unknown>[]>(...guards: Guards): GuardWithErrors<InferGuard<UnionToIntersection<Guards[number]>>> {
    return wrap((v): v is InferGuard<UnionToIntersection<Guards[number]>> => {
      let intersectionPassed = true;
      const intersectionErrors: string[] = [];
      for (const guard of guards) {
        const [success, passed, err] = pcall(guard, v);
        if (!success || !passed) {
          intersectionPassed = false;
          intersectionErrors.push(err!);
        }
      }

      if (!intersectionPassed)
        throw ERROR_TAG + `Intersection member:\n` + intersectionErrors.join("\nAND ") + "\n";

      return intersectionPassed;
    });
  },

  object<Shape extends Record<string, GuardWithErrors<unknown>>>(fieldGuards: Shape, objectName?: string): GuardWithErrors<{ [K in keyof Shape]: InferGuard<Shape[K]> }> {
    return wrap((v): v is { [K in keyof Shape]: InferGuard<Shape[K]> } => {
      let passed = assertType(v, "table");
      if (!passed) return false;

      for (const [name, fieldGuard] of pairs(fieldGuards)) {
        const field = (v as Record<string, unknown>)[name as never];
        const [success, fieldPassed, fieldError] = pcall(fieldGuard as GuardWithErrors<never>, field);
        if (success && fieldPassed) continue;

        passed = false;
        throw ERROR_TAG + `Field '${name}'${objectName !== undefined ? ` of '${objectName}'` : ""}:\n` + fieldError;
      }

      return passed;
    }) as never;
  },

  assertGuard<T>(guard: GuardWithErrors<T>, value: unknown): value is T {
    const [passed] = guard(value);
    return passed;
  }
};

export = z;