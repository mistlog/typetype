# TypeType &middot; [![Build Status](https://github.com/mistlog/typedraft/workflows/build/badge.svg)](https://github.com/mistlog/typedraft/workflows/build/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/mistlog/typetype/badge.svg)](https://coveralls.io/github/mistlog/typetype)

TypeType is designed to generate complex typescript type with ease.

## Usage

```bash
> npm i -D @mistlog/typetype
```

```ts
import { transform } from "@mistlog/typetype";

const input = `
    type function TypeName = (T) => ^{
        if(T extends string) {
            return "string"
        } else {
            return "number"
        }
    }
`;
const output = transform(input).code;
console.log(output);
// output: type TypeName<T> = T extends string ? "string" : "number";
```

## Examples

- repo: https://github.com/mistlog/typetype-examples

In the [url-parser](https://github.com/mistlog/typetype-examples/blob/main/examples/url-parser/url-parser.type) example, `function parseURL` will be translated to generic type `parseURL<text>` in typescript:

```ts
// input
type function parseURL = (text) => ^{
    if (parseProtocol<text> extends [infer protocol, infer rest]) {
        return {
            protocol,
            rest
        }
    } else {
        return never
    }
}
```

```ts
// output
type parseURL<text> = parseProtocol<text> extends [infer protocol, infer rest]
  ? {
      protocol: protocol;
      rest: rest;
    }
  : never;
```

Conditional type is presented in this way:

```ts
^{ if ... else ...}
```

It can be nested so that the logic is clear:

```ts
type function _isNumberString = (text) => ^{
    if(text extends "") {
        return true
    } else if(text extends `${infer digit}${infer rest}`) {
        return ^{
            if(digit extends Digit) {
                return _isNumberString<rest>
            } else {
                return false
            }
        }
    } else {
        return false
    }
}
```

## Syntax

* [examples/syntax](https://github.com/mistlog/typetype-examples/blob/main/examples/syntax/syntax.type)

This project is still primitive, PR is welcomed, feel free to open issues and join us!

### Basic type

```ts
type a = never
type b = number
type c = string
```

```ts
type value = 1
type bool = true
type tuple = [1, 2, 3]
type array = string[][]

type str = "abc"
type template = `value is: ${value}`

type obj = { a: 1; b: "abc"; c: [1, 2] }
type valueDeep = obj["c"][1]

type keys = keyof { a: 1; b: 2 }
```

### Union type

We use "union [...]" or "| [...]" to denote union type.

```ts
type u1 = union [0, 1, 2]
type u2 = | [0, 1, 2]
``` 

### Function type

```ts
type f1 = type () => void
type f2 = type (a:number, b:string) => number
type f3 = type () => type (a:number, b:string) => void
```

### Conditional type

```ts
type conditional = ^{
    if(1 extends string) {
        return "string"
    } else {
        return "number"
    }
}
```

nested: 

```ts
type conditional2 = ^{
    if(1 extends string) {
        return "string"
    } else {
        return ^{
            if(1 extends 1) {
                return "is 1"
            } else {
                return "not 1"
            }
        }
    }
}
```

### Mapped type

```ts
// type mapped1 = { [K in Keys]: boolean }
type mapped1 = ^{
    for(K in Keys) {
        return {
            key: K,
            value: boolean
        }
    }
}

// type mapped2 = { [K in Keys as `get${K}`]: () => string }
type mapped2 = ^{
    for(K in Keys) {
        return {
            key: `get${K}`,
            value: type () => string
        }
    }
}
```

### Generic

```ts
type function Foo = (T) => ^{
    if(T extends {a: infer U, b: infer U}) {
        return U
    } else {
        return never
    }
}
```

With constraint:

* [examples/type-challenges/4-easy-pick](https://github.com/mistlog/typetype-examples/blob/main/examples/type-challenges/4-easy-pick.type)

```ts
export type function MyPick = (T, Keys extends keyof T) => ^{
    for(K in Keys) {
        return {
            key: K,
            value: T[K]
        }
    }
}
```

## How it works?

It's `AST -> AST` transformation.

We use [react-peg](https://github.com/mistlog/react-peg) to write parser, as you can see in [./src/parser/expression](./src/parser/expression/expression.tsx), generator is even simpler than parser, in [./src/generator/generator](./src/generator/generator.ts), `typetype AST` is used to generate corresponding `babel AST`.

## License

This project is [MIT licensed](https://github.com/mistlog/typetype/blob/master/LICENSE).
