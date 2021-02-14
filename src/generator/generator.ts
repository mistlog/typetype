
import * as t from "@babel/types";
import { IInferType, IIdentifier, ITypeExpression, IDeclarator, ITypeIfStatement, IStringTypeLiteral, IStringType, INeverType, ITypeReference, ITypeCallExpression, INumberTypeLiteral, IObjectType, ITupleType, INumberType, ITypeArrowFunctionExpression, ITypeFunctionDeclarator, IConditionalTypeExpression, ITemplateTypeLiteral, ITypeFile } from "../parser";

export function TSFile(ast: ITypeFile): t.File {
    const body = ast.body.map(each => {
        switch (each.kind) {
            case "TypeVariableDeclaration": return TSTypeAliasDeclaration(each.declarator);
            case "TypeFunctionDeclaration": return TSTypeAliasDeclarationWithParams(each.declarator);
            default:
                assertNever(each);
        }
    });
    const file = t.file(t.program(body));
    return file;
}

export type ITypeType = ITypeExpression

export function TSTypeAliasDeclarationWithParams(ast: ITypeFunctionDeclarator): t.TSTypeAliasDeclaration {
    const type = TSTypeAliasDeclaration(ast);
    const params = ast.initializer.params.map((param) =>
        t.tSTypeParameter(null, null, (param as ITypeReference).typeName.name)
    );
    type.typeParameters = t.tsTypeParameterDeclaration(params);
    return type;
}

export function TSTypeAliasDeclaration(ast: IDeclarator): t.TSTypeAliasDeclaration {
    return t.tsTypeAliasDeclaration(Identifier(ast.name), null, TSType(ast.initializer));
}

export function tsConditionalType(ast: ITypeIfStatement): t.TSConditionalType {
    const { condition, consequent, alternate } = ast;
    const falseType = alternate.kind === "TypeIfStatement" ? tsConditionalType(alternate) : TSType(alternate.argument);
    const type = t.tsConditionalType(TSType(condition.checkType), TSType(condition.extendsType), TSType(consequent.argument), falseType);
    return type;
}

export function tsTypeLiteral(ast: IObjectType) {
    const props = ast.props.map(each => {
        switch (each.kind) {
            case "TypeObjectProperty": {
                const key = Identifier(each.name);
                const value = TSType(each.value);
                const prop = t.tsPropertySignature(key, t.tsTypeAnnotation(value));
                return prop;
            }
            case "TypeSpreadProperty": {
                if (each.param.kind === "TypeReference") {
                    const type = TSType(each.param) as t.TSTypeReference;
                    const prop = t.tsPropertySignature(Identifier(each.param.typeName), t.tsTypeAnnotation(type));
                    return prop;
                } else if (each.param.kind === "TypeCallExpression") {
                    const typeName = Identifier(each.param.callee.typeName);
                    const params = each.param.params.map(each => {
                        if (each.kind === "TypeReference") {
                            return TSType(each);
                        }

                        throw new Error(`unkonwn param: ${JSON.stringify(each, null, 4)}`);
                    })
                    const typeReference = t.tsTypeReference(typeName, t.tsTypeParameterInstantiation(params));
                    const prop = t.tsPropertySignature(typeName, t.tsTypeAnnotation(typeReference));
                    return prop;
                }
            }
        }
    });

    const isSpread = ast.props.some(prop => prop.kind === "TypeSpreadProperty");
    if (isSpread) {
        const tsTypeProps = props.map(each => t.tsTypeLiteral([each as t.TSPropertySignature]));
        const assigned = assignObjects(tsTypeProps as t.TSTypeLiteral[]);
        return assigned;
    } else {
        return t.tsTypeLiteral(props as t.TSPropertySignature[]);
    }
}

function assignObjects(objects: t.TSType[]) {
    const name = t.identifier(TypeLibFunction.Object.Assign);
    const params = t.tsTypeParameterInstantiation([t.tsTypeLiteral([]), t.tsTupleType(objects)]);
    const assigned = t.tsTypeReference(name, params);
    return assigned;
}

// function mergeObject(a: t.TSType, b: t.TSType) {
//     const name = t.identifier(TypeLibFunction.Object.Merge);
//     const params = t.tsTypeParameterInstantiation([a, b]);
//     const merged = t.tsTypeReference(name, params);
//     return merged;
// }

/**
 * eg.
 * `a`
 * `${a}`
 * `${a}${b}`
 * `${a}b${c}`
 * `${a}b${c}d`
 * `a${b}c${d}e`
 */
function templateLiteral(ast: ITemplateTypeLiteral): t.TemplateLiteral {
    const { items } = ast;

    const quasis: t.TemplateElement[] = [];
    const expressions: t.TSType[] = [];

    items.forEach((each, index) => {
        if (each.kind === "TemplateElement") {
            quasis.push(t.templateElement({ raw: each.value }));
        } else if (each.kind === "TemplateExpression") {
            if (quasis.length === expressions.length) {
                quasis.push(t.templateElement({ raw: "" }));
            }
            expressions.push(TSType(each.expression));
            if (index === items.length - 1) {
                quasis.push(t.templateElement({ raw: "" }, true));
            }
        }
    });
    return t.templateLiteral(quasis, expressions);
}

type Kind<T extends ITypeType> = T["kind"];

type TypeInTS<T extends ITypeType> =
    /**
     */
    Kind<T> extends Kind<IStringTypeLiteral> ? t.TSLiteralType :
    Kind<T> extends Kind<INumberTypeLiteral> ? t.TSLiteralType :
    Kind<T> extends Kind<ITemplateTypeLiteral> ? t.TemplateLiteral :
    /**
     */
    Kind<T> extends Kind<IStringType> ? t.TSStringKeyword :
    Kind<T> extends Kind<INeverType> ? t.TSNeverKeyword :
    Kind<T> extends Kind<INumberType> ? t.TSNumberKeyword :
    Kind<T> extends Kind<IObjectType> ? t.TSTypeLiteral :
    Kind<T> extends Kind<ITupleType> ? t.TSTupleType :
    /**
     */
    Kind<T> extends Kind<ITypeReference> ? t.TSTypeReference :
    Kind<T> extends Kind<IInferType> ? t.TSInferType :
    Kind<T> extends Kind<ITypeArrowFunctionExpression> ? t.TSConditionalType :
    Kind<T> extends Kind<IConditionalTypeExpression> ? t.TSConditionalType :
    Kind<T> extends Kind<ITypeCallExpression> ? t.TSConditionalType : t.TSType;

export function TSType(ast: ITypeType): TypeInTS<typeof ast> {
    switch (ast.kind) {
        /**
         */
        case "StringTypeLiteral": return t.tsLiteralType(t.stringLiteral(ast.value));
        case "NumberTypeLiteral": return t.tsLiteralType(t.numericLiteral(ast.value));
        case "BooleanTypeLiteral": return t.tsLiteralType(t.booleanLiteral(ast.value));
        case "TemplateTypeLiteral": return {
            type: "TSLiteralType",
            literal: templateLiteral(ast)
        } as any as t.TSLiteralType; /** TODO: use t.tsLiteralType to create it */
        /**
         */
        case "StringType": return t.tsStringKeyword();
        case "NeverType": return t.tsNeverKeyword();
        case "NumberType": return t.tsNumberKeyword();
        case "ObjectType": return tsTypeLiteral(ast);
        case "TupleType": return t.tsTupleType(ast.items.map(item => TSType(item)));
        /**
         */
        case "TypeReference": return t.tsTypeReference(Identifier(ast.typeName));
        case "InferType": return t.tsInferType(t.tSTypeParameter(null, null, ast.typeName.name));
        case "TypeArrowFunctionExpression": return TSType(ast.body);
        case "TypeCallExpression": {
            const type = TSType(ast.callee) as TypeInTS<typeof ast.callee>;
            const params = ast.params.map(param => TSType(param));
            type.typeParameters = t.tsTypeParameterInstantiation(params);
            return type;
        }
        case "ConditionalTypeExpression": return tsConditionalType(ast.body);
        case "UnionType": return t.tsUnionType(ast.types.map(each => TSType(each)));

        default:
            return assertNever(ast);
    }
}

function Identifier(ast: IIdentifier): t.Identifier {
    return t.identifier(ast.name);
}

function assertNever(ast: never): never {
    throw new Error("Unexpected ast: " + JSON.stringify(ast, null, 4));
}

export const TypeLibFunction = {
    Object: {
        // Merge: "object$merge",
        Assign: "object$assign",
    }
}