# TypeType &middot; [![Build Status](https://github.com/mistlog/typedraft/workflows/build/badge.svg)](https://github.com/mistlog/typedraft/workflows/build/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/mistlog/typetype/badge.svg)](https://coveralls.io/github/mistlog/typetype)

TypeType is designed to generate complex typescript type with ease.

## Get started & Examples

* repo: https://github.com/mistlog/typetype-examples

In [url-parser](https://github.com/mistlog/typetype-examples/blob/main/examples/url-parser/url-parser.type) example, the `function parseURL` will be translated to generic type `parseURL<text>` in typescript:

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
type parseURL<text> = parseProtocol<text> extends [infer protocol, infer rest] ? {
  protocol: protocol;
  rest: rest;
} : never;
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

This project is still primitive, PR is welcomed, feel free to open issues and join us!

## How it works?

It's `AST -> AST` transformation.

We use [react-peg](https://github.com/mistlog/react-peg) to write parser, as you can see in [./src/parser/expression](./src/parser/expression/expression.tsx), generator is even simpler than parser, in [./src/generator/generator](./src/generator/generator.ts), `typetype AST` is used to generate corresponding `babel AST`.

## License

This project is [MIT licensed](https://github.com/mistlog/typetype/blob/master/LICENSE).