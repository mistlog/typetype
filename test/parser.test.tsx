import { ReactPeg } from "react-peg";
import { TypeExpressionList, TypeForInStatement, IndexType, OperatorType, TypeFile, TypeReturnStatement, ObjectType, TemplateChar, TemplateCharSequence, TemplateElement, TemplateExpression, TemplateTypeLiteral, TupleType, TypeObjectProperty, Identifier, BasicType, ExtendsClause, TypeIfStatement, TypeVariableDeclaration, TypeFunctionDeclaration, ConditionalTypeExpression, TypeArrowFunctionExpression, ParamList, TypeCallExpression, InferType, KeyOfType, TypeExpression, ImportDeclaration } from "../src";
import { saveAST, loadType } from "./common";

/**
 * TODO: move it to /parser
 */
test("Identifier", () => {
    const parser = ReactPeg.render(<Identifier />);
    expect(parser.parse("result")).toMatchSnapshot();
})

test("BasicType", () => {
    const parser = ReactPeg.render(<BasicType />);
    expect(parser.parse("never")).toMatchSnapshot();
    expect(parser.parse("string")).toMatchSnapshot();
    expect(parser.parse("number")).toMatchSnapshot();
    expect(parser.parse("any")).toMatchSnapshot();
    expect(parser.parse("object")).toMatchSnapshot();

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

test("TypeForInStatement", () => {
    const parser = ReactPeg.render(<TypeForInStatement />);

    expect(parser.parse(`
        for(K in Keys) {
            return {
                key: K,
                value: boolean
            }
        }
    `)).toMatchSnapshot();
})

test("TypeForInStatement: 2", () => {
    const parser = ReactPeg.render(<TypeForInStatement />);

    expect(parser.parse(`
        for(K in Keys) {
            return {
                key: \`get\${K}\`,
                value: type () => string
            }
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

test("ImportDeclaration", () => {
    const parser = ReactPeg.render(<ImportDeclaration />);
    const ast = parser.parse(`
        import { Temp } from "./temp"
    `);
    saveAST(ast, "ImportDeclaration.json");
    expect(ast).toMatchSnapshot();
})

test("ImportDeclaration: 2", () => {
    const parser = ReactPeg.render(<ImportDeclaration />);
    const ast = parser.parse(`
        import { Temp, Temp2 } from "./temp"
    `);
    saveAST(ast, "ImportDeclaration-2.json");
    expect(ast).toMatchSnapshot();
})

test("TypeVariableDeclaration: function", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);
    const ast = parser.parse(`
        type result = type (a:number, b:string) => void
    `);
    saveAST(ast, "TypeVariableDeclaration-Function.json");
    expect(ast).toMatchSnapshot();
})

test("TypeVariableDeclaration: export", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);
    const ast = parser.parse(`
        export type result = string
    `);
    saveAST(ast, "TypeVariableDeclaration-Export.json");
    expect(ast).toMatchSnapshot();
})

test("TypeVariableDeclaration: keyof", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);
    const ast = parser.parse(`
        type result = keyof {a:1, b:2}
    `);
    saveAST(ast, "TypeVariableDeclaration-KeyOf.json");
    expect(ast).toMatchSnapshot();
})

// type result<> = ...
test("TypeVariableDeclaration: conditional type", () => {
    const parser = ReactPeg.render(<TypeVariableDeclaration />);


    expect(() => {
        const ast = parser.parse(`
            type result = () => ^{
                if(string extends string) {
                    return string
                } else {
                    return number
                }
            }
        `);
        expect(ast).toMatchSnapshot();
    }).toThrowErrorMatchingSnapshot();

    //
    const ast = parser.parse(`
        type result = ^{
            if(string extends string) {
                return string
            } else {
                return number
            }
        }
    `);
    expect(ast).toMatchSnapshot();
    saveAST(ast, "TypeVariableDeclaration-ConditionalType.json");
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

test("TypeFunctionDeclaration: default param", () => {
    const parser = ReactPeg.render(<TypeFunctionDeclaration />);
    const ast = parser.parse(`
        type function TypeName = (T = any) => ^{
            if(T extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeFunctionDeclaration-DefaultParam.json");
    expect(ast).toMatchSnapshot();
})

test("TypeFunctionDeclaration: export", () => {
    const parser = ReactPeg.render(<TypeFunctionDeclaration />);
    const ast = parser.parse(`
        export type function TypeName = (T) => ^{
            if(T extends string) {
                return "string"
            } else {
                return "number"
            }
        }
    `);
    saveAST(ast, "TypeFunctionDeclaration-Export.json");
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
    const templateTypeLiteral5 = loadType("TemplateTypeLiteral-5");

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

    {
        const parser = ReactPeg.render(<TemplateTypeLiteral />);
        const ast = parser.parse(templateTypeLiteral5);
        saveAST(ast, "TemplateTypeLiteral-5.json");
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
    const ast = parser.parse(`protocol, rest extends number`);
    saveAST(ast, "ParamList.json");
    expect(ast).toMatchSnapshot();


    expect(parser.parse(`protocol`)).toMatchSnapshot();
    expect(parser.parse(`protocol extends string`)).toMatchSnapshot();
})

test("TypeExpressionList", () => {
    const parser = ReactPeg.render(<TypeExpressionList />);
    const ast = parser.parse(`protocol, rest`);
    saveAST(ast, "TypeExpressionList.json");
    expect(ast).toMatchSnapshot();

    expect(parser.parse(`protocol`)).toMatchSnapshot();
    expect(parser.parse(``)).toMatchSnapshot();
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

test("TypeFile", () => {
    const parser = ReactPeg.render(<TypeFile />);
    const ast = parser.parse(`
        type temp = string
        type function func = (T) => {a: T}
    `);
    saveAST(ast, "TypeFile.json");
    expect(ast).toMatchSnapshot();
})

test("KeyOfType", () => {
    const parser = ReactPeg.render(<KeyOfType />);
    const ast = parser.parse(`keyof {a:1, b:2}`);
    saveAST(ast, "KeyOfType.json");
    expect(ast).toMatchSnapshot();
})

test("OperatorType: keyof", () => {
    const parser = ReactPeg.render(<OperatorType />);
    const ast = parser.parse(`keyof {a:1, b:2}`);
    saveAST(ast, "OperatorType.json");
    expect(ast).toMatchSnapshot();
})

test("IndexType", () => {
    const parser = ReactPeg.render(<IndexType />);
    const ast = parser.parse(`obj["a"]`);
    saveAST(ast, "IndexType.json");
    expect(ast).toMatchSnapshot();
})

test("IndexType: deep", () => {
    const parser = ReactPeg.render(<TypeExpression />);
    const ast = parser.parse(`obj["a"][2]`);
    saveAST(ast, "IndexType-Deep.json");
    expect(ast).toMatchSnapshot();
})

test("MappedType", () => {
    const parser = ReactPeg.render(<TypeExpression />);
    // { [K in Keys]: boolean }
    const ast = parser.parse(`
        ^{
            for(K in Keys) {
                return {
                    key: K,
                    value: boolean
                }
            }
        }
    `);
    saveAST(ast, "MappedType.json");
    expect(ast).toMatchSnapshot();
})

test("MappedType: as", () => {
    const parser = ReactPeg.render(<TypeExpression />);
    // { [K in Keys as `get${K}`]: () => string }
    const ast = parser.parse(`
        ^{
            for(K in Keys) {
                return {
                    key: \`get\${K}\`,
                    value: type () => string
                }
            }
        }
    `);
    saveAST(ast, "MappedType-As.json");
    expect(ast).toMatchSnapshot();
})