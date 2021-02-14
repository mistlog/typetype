import { loadAST, saveCode, generateCode } from "./common";
import { TSTypeAliasDeclaration, TSType, TSTypeAliasDeclarationWithParams, TSFile, ITypeVariableDeclaration, ITypeFunctionDeclaration, ITypeFile } from "../src";

describe("type file", () => {
    test("TypeFile", () => {
        const ast = loadAST(`TypeFile.json`) as ITypeFile;
        const tsAST = TSFile(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })
})

describe("declaration", () => {
    test("TypeVariableDeclaration", () => {
        const ast = loadAST(`TypeVariableDeclaration.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast.declarator);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: conditional type", () => {
        const ast = loadAST(`TypeVariableDeclaration-ConditionalType.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast.declarator);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeFunctionDeclaration", () => {
        const ast = loadAST(`TypeFunctionDeclaration.json`) as ITypeFunctionDeclaration;
        const tsAST = TSTypeAliasDeclarationWithParams(ast.declarator);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })
})


describe("ts-type", () => {
    function toCode(name: string) {
        const ast = loadAST(`${name}.json`);
        const tsAST = TSType(ast);
        const code = generateCode(tsAST);
        saveCode(code, `${name}`)
        return code;
    }

    test("UnionType", () => {
        const name = "UnionType";
        expect(toCode(name)).toMatchSnapshot();
    })
    
    test("TypeArrowFunctionExpression", () => {
        const name = "TypeArrowFunctionExpression";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("TypeArrowFunctionExpression: with params", () => {
        const name = "TypeArrowFunctionExpression-WithParams";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("TypeArrowFunctionExpression: with infer", () => {
        const name = "TypeArrowFunctionExpression-Infer";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("TupleType: with infer", () => {
        const name = "TupleType-Infer";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType", () => {
        const name = "ObjectType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType: shorthand", () => {
        const name = "ObjectType-Shorthand";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType: spread", () => {
        const name = "ObjectType-Spread";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ConditionalTypeExpression", () => {
        const name = "ConditionalTypeExpression";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("TemplateTypeLiteral", () => {
        const name = "TemplateTypeLiteral";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ConditionalTypeExpression: 2", () => {
        const name = "ConditionalTypeExpression-2";
        expect(toCode(name)).toMatchSnapshot();
    })
})

describe("examples", () => {
    function toCode(name: string) {
        const ast = loadAST(`${name}.json`) as ITypeFunctionDeclaration;
        const tsAST = TSTypeAliasDeclarationWithParams(ast.declarator);
        const code = generateCode(tsAST);
        saveCode(code, `${name}`)
        return code;
    }

    test("parseURL", () => {
        const name = "Example-parseURL";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parseURL: 2", () => {
        const name = "Example-parseURL-2";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parseProtocol", () => {
        const name = "Example-parseProtocol";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parseUserInfo", () => {
        const name = "Example-parseUserInfo";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parseAuthority", () => {
        const name = "Example-parseAuthority";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("_isNumberString", () => {
        const name = "Example-_isNumberString";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parsePort", () => {
        const name = "Example-parsePort";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("isNumberString", () => {
        const name = "Example-isNumberString";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("parseHost", () => {
        const name = "Example-parseHost";
        expect(toCode(name)).toMatchSnapshot();
    })
})