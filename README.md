# @rbxts/z

Type validation with detailed errors

Alternative to @rbxts/t

## Basics

```ts
import z from "@rbxts/z";

const basicGuard = z.string();
{
  const [passed, err] = guard("hello!");
  print(passed, err); // true
}
{
  const [passed, err] = guard(69);
  print(passed, err); // false  Expected 'string', got 'number'
}
```

## Objects

```ts
const isFooObject = z.object({
  foo: z.literal("bar")
});

const [passed, err] = isFooObject({ foo: "bar" });
print(passed, err); // true
```

## Type Narrowing

```ts
const isFooObject = z.object({
  foo: z.literal("bar")
});

const value = ...;
if (z.assertGuard(isFooObject, value))
  print(value.foo); // bar
```
