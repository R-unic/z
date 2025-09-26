# @rbxts/z

Type validation with detailed errors.

Alternative to `@rbxts/t`.

## Basics

```ts
import z from "@rbxts/z";

{
  const result = z.string("hello!");
  if (result.success)
    print(result.value) // hello!
}
{
  const result = z.string(69);
  if (!result.success)
    print(result.errors[0].message) // Expected 'string', got: 69
}
```

## Unions

```ts
const isStringOrNumber = z.union(z.string, z.number);

{
  const result = isStringOrNumber(69);
  if (result.success)
    print(result.value) // 69
}
{
  const result = isStringOrNumber("abc");
  if (result.success)
    print(result.value) // abc
}
```
