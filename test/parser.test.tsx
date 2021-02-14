import { ReactPeg } from "react-peg";
import { TypeFile, TypeReturnStatement, ObjectType, TemplateChar, TemplateCharSequence, TemplateElement, TemplateExpression, TemplateTypeLiteral, TupleType, TypeObjectProperty, Identifier, BasicType, ExtendsClause, TypeIfStatement, TypeVariableDeclaration, TypeFunctionDeclaration, ConditionalTypeExpression, TypeArrowFunctionExpression, ParamList, TypeCallExpression, InferType } from "../src";
import { saveAST, loadType } from "./common";

test("Identifier", () => {
    const parser = ReactPeg.render(<Identifier />);
    expect(parser.parse("result")).toMatchSnapshot();
})

test("BasicType", () => {
    const parser = ReactPeg.render(<BasicType />);
    expect(parser.parse("never")).toMatchSnapshot();
    expect(parser.parse("string")).toMatchSnapshot();
    expect(parser.parse("number")).toMatchSnapshot();
})

test("ExtendsClause", () => {
    const parser = ReactPeg.render(<ExtendsClause />);
    expect(parser.parse("T extends string")).toMatchSnapshot();
})

test("ExtendsClause: type function call", () => {
    const parser = ReactPeg.render(<ExtendsClause />);
    expect(parser.parse(`TypeName<T> extends string`)).toMatchSnapshot();
})

test("TypeReturnStatement", () => {
    const parser = ReactPeg.render(<TypeReturnStatement />);
    expect(parser.parse("return string")).toMatchSnapshot();
})

test("TypeIfStatement", () => {
    const parser = ReactPeg.render(<TypeIfStatement />);

    expect(parser.parse(`
        if(T extends string) {
            return "string"
        } else {
            return "number"
        }
    `)).toMatchSnapshot();
})

test("ConditionalTypeExpression", () => {
    const parser = ReactPeg.render(<ConditionalTypeExpression />);
    const ast = parser.parse(`
        ^{
            if(string extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "ConditionalTypeExpression.json");
    expect(ast).toMatchSnapshot();
})

test("ConditionalTypeExpression: 2", () => {
    const parser = ReactPeg.render(<ConditionalTypeExpression />);
    const ast = parser.parse(`
        ^{
            if(T extends string) {
                return "string"
            } else if(T extends number) {
                return "number"
            } else {
                return never
            }
        }
    `);
    saveAST(ast, "ConditionalTypeExpression-2.json");
    expect(ast).toMatchSnapshot();
})

test("TypeArrowFunctionExpression", () => {
    const parser = ReactPeg.render(<TypeArrowFunctionExpression />);
    const ast = parser.parse(`
        () => ^{
            if(string extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeArrowFunctionExpression.json");
    expect(ast).toMatchSnapshot();
})

test("TypeArrowFunctionExpression: with params", () => {
    const parser = ReactPeg.render(<TypeArrowFunctionExpression />);
    const ast = parser.parse(`
        (T) => ^{
            if(T extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeArrowFunctionExpression-WithParams.json");
    expect(ast).toMatchSnapshot();
})

test("TypeArrowFunctionExpression: with infer", () => {
    const parser = ReactPeg.render(<TypeArrowFunctionExpression />);
    const ast = parser.parse(`
        () => ^{
            if(T extends infer U) {
                return U
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeArrowFunctionExpression-Infer.json");

    expect(ast).toMatchSnapshot();
})

test("TypeVariableDeclaration", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);
    const ast = parser.parse(`
        type result = string
    `);
    saveAST(ast, "TypeVariableDeclaration.json");
    expect(ast).toMatchSnapshot();
})

// type result<> = ...
test("TypeVariableDeclaration: conditional type", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);
    const ast = parser.parse(`
        type result = () => ^{
            if(string extends string) {
                return string
            } else {
                return number
            }
        }
    `);
    saveAST(ast, "TypeVariableDeclaration-ConditionalType.json");
    expect(ast).toMatchSnapshot();
})

test("TypeIfStatement", () => {
    const parser = ReactPeg.render(<TypeIfStatement />);
    const ast = parser.parse(`
        if(T extends string) {
            return "string"
        } else {
            return "number"
        }
    `);
    saveAST(ast, "TypeIfStatement.json");
    expect(ast).toMatchSnapshot();
})
test("TypeFunctionDeclaration", () => {
    const parser = ReactPeg.render(<TypeFunctionDeclaration />);
    const ast = parser.parse(`
        type function TypeName = (T) => ^{
            if(T extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeFunctionDeclaration.json");
    expect(ast).toMatchSnapshot();
})

test("InferType", () => {
    const parser = ReactPeg.render(<InferType />);
    const ast = parser.parse(`infer protocol`);
    saveAST(ast, "InferType.json");
    expect(ast).toMatchSnapshot();


    expect(() => {
        expect(parser.parse(`infer `)).toMatchSnapshot();

    }).toThrowErrorMatchingSnapshot();
})

test("TypeFunctionDeclaration: with infer", () => {
    const parser = ReactPeg.render(<TypeFunctionDeclaration />);
    const ast = parser.parse(`
        type function ParseURL = (text) => ^{
            if(text extends infer protocal) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeFunctionDeclaration-Infer.json");
    expect(ast).toMatchSnapshot();
})

test("TypeFunctionDeclaration: with TemplateTypeLiteral", () => {
    const parser = ReactPeg.render(<TypeFunctionDeclaration />);
    const ast = parser.parse(`
        type function ParseProtocol = (text) => ^{
            if(text extends \`\${infer protocol}://\${infer rest}\`) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeFunctionDeclaration-TemplateTypeLiteral.json");
    expect(ast).toMatchSnapshot();
})

test("TemplateTypeLiteral", () => {
    const templateTypeLiteral = loadType("TemplateTypeLiteral");
    const templateTypeLiteral2 = loadType("TemplateTypeLiteral-2");
    const templateTypeLiteral3 = loadType("TemplateTypeLiteral-3");
    const templateTypeLiteral4 = loadType("TemplateTypeLiteral-4");

    {
        const parser = ReactPeg.render(<TemplateTypeLiteral />);
        const ast = parser.parse(templateTypeLiteral);
        saveAST(ast, "TemplateTypeLiteral.json");
        expect(ast).toMatchSnapshot();
    }

    {
        const parser = ReactPeg.render(<TemplateTypeLiteral />);
        const ast = parser.parse(templateTypeLiteral2);
        saveAST(ast, "TemplateTypeLiteral-2.json");
        expect(ast).toMatchSnapshot();
    }

    {
        const parser = ReactPeg.render(<TemplateTypeLiteral />);
        const ast = parser.parse(templateTypeLiteral3);
        saveAST(ast, "TemplateTypeLiteral-3.json");
        expect(ast).toMatchSnapshot();
    }

    {
        const parser = ReactPeg.render(<TemplateTypeLiteral />);
        const ast = parser.parse(templateTypeLiteral4);
        saveAST(ast, "TemplateTypeLiteral-4.json");
        expect(ast).toMatchSnapshot();
    }
})

test("TemplateChar", () => {
    const parser = ReactPeg.render(<TemplateChar />);
    const templateCharEscapeQuote = loadType("TemplateChar");
    expect(parser.parse(templateCharEscapeQuote)).toEqual(templateCharEscapeQuote)
    expect(parser.parse(`{`)).toEqual(`{`)
    expect(parser.parse(`@`)).toEqual(`@`)
})

test("TemplateCharSequence", () => {
    const parser = ReactPeg.render(<TemplateCharSequence />);
    expect(parser.parse(`hello`)).toEqual(`hello`)
})

test("TemplateElement", () => {
    const parser = ReactPeg.render(<TemplateElement />);
    expect(parser.parse(`hello  `)).toMatchSnapshot();
})

test("TemplateExpression", () => {
    const parser = ReactPeg.render(<TemplateExpression />);
    const templateExpression = loadType("TemplateExpression");
    expect(parser.parse(templateExpression)).toMatchSnapshot();
})

test("ParamList", () => {
    const parser = ReactPeg.render(<ParamList />);
    const ast = parser.parse(`protocol, rest`);
    saveAST(ast, "ParamList.json");
    expect(ast).toMatchSnapshot();


    expect(parser.parse(`protocol`)).toMatchSnapshot();
})

test("ParamList: empty", () => {
    const parser = ReactPeg.render(<ParamList />);
    const ast = parser.parse(``);
    saveAST(ast, "ParamList-Empty.json");
    expect(ast).toMatchSnapshot();
})

test("TypeCallExpression", () => {
    const parser = ReactPeg.render(<TypeCallExpression />);
    const ast = parser.parse(`ParseProtocol<T>`);
    saveAST(ast, "TypeCallExpression.json");
    expect(ast).toMatchSnapshot();

    const typeCallExpression = loadType("TypeCallExpression");
    expect(parser.parse(typeCallExpression)).toMatchSnapshot();
})

test("TypeCallExpression: empty", () => {
    const parser = ReactPeg.render(<TypeCallExpression />);
    const ast = parser.parse(`ParseProtocol<>`);
    saveAST(ast, "TypeCallExpression-Empty.json");
    expect(ast).toMatchSnapshot();
})

test("TupleType", () => {
    const parser = ReactPeg.render(<TupleType />);
    const ast = parser.parse(`[protocol, rest]`);
    saveAST(ast, "TupleType.json");
    expect(ast).toMatchSnapshot();
})

test("TupleType: with infer", () => {
    const parser = ReactPeg.render(<TupleType />);
    const ast = parser.parse(`[infer protocol, infer rest]`);
    saveAST(ast, "TupleType-Infer.json");
    expect(ast).toMatchSnapshot();
})

test("TypeObjectProperty", () => {
    const parser = ReactPeg.render(<TypeObjectProperty />);
    expect(parser.parse(`a: number`)).toMatchSnapshot();
    expect(parser.parse(`b: string`)).toMatchSnapshot();
    expect(parser.parse(`c: 1`)).toMatchSnapshot();
    expect(parser.parse(`d: "abc"`)).toMatchSnapshot();
})

test("ObjectType", () => {
    const parser = ReactPeg.render(<ObjectType />);
    const ast = parser.parse(`
        {
            a: number,
            b: string,
            c: 1,
            d: "abc"
        }
    `);
    saveAST(ast, "ObjectType.json");
    expect(ast).toMatchSnapshot();

    //
    expect(parser.parse(`{}`)).toMatchSnapshot();
})

test("ObjectType: shorthand", () => {
    const parser = ReactPeg.render(<ObjectType />);
    const ast = parser.parse(`
        {
            hello
        }
    `);
    saveAST(ast, "ObjectType-Shorthand.json");
    expect(ast).toMatchSnapshot();
})

test("ObjectType: spread", () => {
    const parser = ReactPeg.render(<ObjectType />);
    const ast = parser.parse(`
        {
            hello,
            ...obj
        }
    `);
    saveAST(ast, "ObjectType-Spread.json");
    expect(ast).toMatchSnapshot();
})

test("TypeFile", () => {
    const parser = ReactPeg.render(<TypeFile />);
    const ast = parser.parse(`
        type temp = string
        type function func = (T) => {a: T}
    `);
    saveAST(ast, "TypeFile.json");
    expect(ast).toMatchSnapshot();
})

describe("examples", () => {
    function toAST(name: string) {
        const parser = ReactPeg.render(<TypeFunctionDeclaration />);
        const code = loadType(name);
        const ast = parser.parse(code);
        saveAST(ast, `${name}.json`);
        return ast;
    }

    test("parseURL", () => {
        const name = "Example-parseURL";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseURL: 2", () => {
        const name = "Example-parseURL-2";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseProtocol", () => {
        const name = "Example-parseProtocol";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseUserInfo", () => {
        const name = "Example-parseUserInfo";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseAuthority", () => {
        const name = "Example-parseAuthority";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("_isNumberString", () => {
        const name = "Example-_isNumberString";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parsePort", () => {
        const name = "Example-parsePort";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("isNumberString", () => {
        const name = "Example-isNumberString";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseHost", () => {
        const name = "Example-parseHost";
        expect(toAST(name)).toMatchSnapshot();
    })
})