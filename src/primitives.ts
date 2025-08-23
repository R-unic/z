import { guard, success, failure, ROOT_PATH } from "./utility";
import type { Guard, ValidationResult } from "./types";

function primitive<T extends keyof CheckableTypes>(typeName: T): Guard<CheckableTypes[T]> {
  return guard(
    typeName,
    (value: unknown, path = ROOT_PATH): ValidationResult<CheckableTypes[T]> =>
      typeIs(value, typeName)
        ? success(value)
        : failure(path, typeName, value)
  );
}

type PrimitiveTypeName = keyof Omit<CheckableTypes, "table">;
type TypeMap<V = boolean> = { [T in PrimitiveTypeName]: V };
const types: TypeMap = {
  nil: true,
  boolean: true,
  string: true,
  number: true,
  userdata: true,
  function: true,
  thread: true,
  vector: true,
  buffer: true,
  Axes: true,
  BrickColor: true,
  CFrame: true,
  Color3: true,
  ColorSequence: true,
  ColorSequenceKeypoint: true,
  DateTime: true,
  DockWidgetPluginGuiInfo: true,
  Enum: true,
  EnumItem: true,
  Enums: true,
  Faces: true,
  FloatCurveKey: true,
  Font: true,
  Instance: true,
  NumberRange: true,
  NumberSequence: true,
  NumberSequenceKeypoint: true,
  OverlapParams: true,
  PathWaypoint: true,
  PhysicalProperties: true,
  Random: true,
  Ray: true,
  RaycastParams: true,
  RaycastResult: true,
  RBXScriptConnection: true,
  RBXScriptSignal: true,
  Rect: true,
  Region3: true,
  Region3int16: true,
  TweenInfo: true,
  UDim: true,
  UDim2: true,
  Vector2: true,
  Vector2int16: true,
  Vector3: true,
  Vector3int16: true
};

const primitiveGuards: { [K in PrimitiveTypeName]: Guard<CheckableTypes[K]> } = {} as never;
for (const [name] of pairs(types))
  primitiveGuards[name] = primitive(name) as never;

export { primitiveGuards };