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
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: context type", () => {
        const ast = loadAST(`TypeVariableDeclaration-ContextType.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: conditional type", () => {
        const ast = loadAST(`TypeVariableDeclaration-ConditionalType.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: export", () => {
        const ast = loadAST(`TypeVariableDeclaration-Export.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: keyof", () => {
        const ast = loadAST(`TypeVariableDeclaration-KeyOf.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeVariableDeclaration: function", () => {
        const ast = loadAST(`TypeVariableDeclaration-Function.json`) as ITypeVariableDeclaration;
        const tsAST = TSTypeAliasDeclaration(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeFunctionDeclaration", () => {
        const ast = loadAST(`TypeFunctionDeclaration.json`) as ITypeFunctionDeclaration;
        const tsAST = TSTypeAliasDeclarationWithParams(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeFunctionDeclaration: default param", () => {
        const ast = loadAST(`TypeFunctionDeclaration-DefaultParam.json`) as ITypeFunctionDeclaration;
        const tsAST = TSTypeAliasDeclarationWithParams(ast);
        expect(generateCode(tsAST)).toMatchSnapshot();
    })

    test("TypeFunctionDeclaration: export", () => {
        const ast = loadAST(`TypeFunctionDeclaration-Export.json`) as ITypeFunctionDeclaration;
        const tsAST = TSTypeAliasDeclarationWithParams(ast);
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
    test("ParenthesizedType", () => {
        const name = "ParenthesizedType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("MappedType", () => {
        const name = "MappedType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("MappedType: as", () => {
        const name = "MappedType-As";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType", () => {
        const name = "FunctionType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: constructor", () => {
        const name = "FunctionType-Constructor";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: optional param", () => {
        const name = "FunctionType-OptionalParam";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: params", () => {
        const name = "FunctionType-Params";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: rest", () => {
        const name = "FunctionType-Rest";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: nested", () => {
        const name = "FunctionType-Nested";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("FunctionType: type param", () => {
        const name = "FunctionType-TypeParam";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ArrayType", () => {
        const name = "ArrayType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ArrayType: readonly", () => {
        const name = "ArrayType-Readonly";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ArrayType: any", () => {
        const name = "ArrayType-Any";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ArrayType: deep", () => {
        const name = "ArrayType-Deep";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("IndexType", () => {
        const name = "IndexType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("IndexType: deep", () => {
        const name = "IndexType-Deep";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("StringTypeLiteral", () => {
        const name = "String-SpecialChar";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("UnionType", () => {
        const name = "UnionType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("UnionType: special char", () => {
        const name = "UnionType-SpecialChar";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("IntersectionType", () => {
        const name = "IntersectionType";
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

    test("TupleType: rest", () => {
        const name = "TupleType-Rest";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("TupleType: readonly", () => {
        const name = "TupleType-Readonly";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType", () => {
        const name = "ObjectType";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType: whitespace in key", () => {
        const name = "ObjectType-Key-WhiteSpace";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("ObjectType: call signature", () => {
        const name = "ObjectType-CallSignature";
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

    test("ObjectType: modifier", () => {
        const name = "ObjectType-Modifier";
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
        const tsAST = TSTypeAliasDeclarationWithParams(ast);
        const code = generateCode(tsAST);
        saveCode(code, `${name}`)
        return code;
    }

    test("readonly", () => {
        const name = "Example-readonly";
        expect(toCode(name)).toMatchSnapshot();
    })

    test("pick", () => {
        const name = "Example-pick";
        expect(toCode(name)).toMatchSnapshot();
    })

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