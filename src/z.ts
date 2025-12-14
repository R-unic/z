import { primitiveGuards } from "./primitives";
import { guard, success, failure, ROOT_PATH } from "./utility";
import type { Guard, InferGuard } from "./types";

type ElementType<A extends any[]> = A extends (infer E)[] ? E : never;

const nan = guard(
  "nan",
  (value, path = ROOT_PATH) => {
    const primitiveResult = primitiveGuards.number(value);
    return primitiveResult.success && value !== value
      ? success(primitiveResult.value)
      : failure(path, "nan", value)
  }
);

function range(min: number, max: number): Guard<number> {
  const typeName = `number (${min}-${max})`;
  return guard(
    typeName,
    (value, path = ROOT_PATH) => {
      const primitiveResult = primitiveGuards.number(value);
      return primitiveResult.success && primitiveResult.value >= min && primitiveResult.value <= max
        ? success(primitiveResult.value)
        : failure(path, typeName, value)
    }
  );
}

function intersection<T extends Guard<any>[]>(...guards: T): Guard<UnionToIntersection<InferGuard<T[number]>>> {
  const typeName = guards.join(" & ");
  return guard(
    typeName,
    (value, path = ROOT_PATH) => {
      const results = guards.map(guard => guard(value))
      return results.some(result => !result.success)
        ? failure(path, typeName, value)
        : success(value as never);
    }
  );
}

function union<T extends Guard<any>[]>(...guards: T): Guard<InferGuard<ElementType<T>>> {
  const typeName = guards.join(" | ");
  return guard(
    typeName,
    (value, path = ROOT_PATH) => {
      const results = guards.map(guard => guard(value))
      return results.every(result => !result.success)
        ? failure(path, typeName, value)
        : success(value as never);
    }
  );
}

const z = {
  ...primitiveGuards,
  nan,
  range,
  intersection,
  union
};
table.freeze(z);

export = z;