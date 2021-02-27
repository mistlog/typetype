
import * as t from "@babel/types";
import { IInferType, IIdentifier, ITypeExpression, ITypeIfStatement, IStringTypeLiteral, IStringType, INeverType, ITypeReference, ITypeCallExpression, INumberTypeLiteral, IObjectType, ITupleType, INumberType, ITypeArrowFunctionExpression, ITypeFunctionDeclarator, IConditionalTypeExpression, ITemplateTypeLiteral, ITypeFile, IDeclaration, ITypeFunctionDeclaration, IUnionType, IKeyOfType, IIndexType, IArrayType, IFunctionType, IMappedTypeExpression, ITypeForInStatement, IIntersectionType, ITypeObjectProperty, IAnyType, IReadonlyArray, IOperatorType, IReadonlyTuple, IRestType } from "../parser";

export function TSFile(ast: ITypeFile): t.File {
    const body = ast.body.map(each => {
        switch (each.kind) {
            case "TypeVariableDeclaration": return TSTypeAliasDeclaration(each);
            case "TypeFunctionDeclaration": return TSTypeAliasDeclarationWithParams(each);
            default:
                assertNever(each);
        }
    });
    const file = t.file(t.program(body));
    return file;
}

export type ITypeType = ITypeExpression | IRestType;

export function TSTypeAliasDeclarationWithParams(ast: ITypeFunctionDeclaration): t.TSTypeAliasDeclaration | t.ExportNamedDeclaration {
    const _type = TSTypeAliasDeclaration(ast);
    const type = t.isExportNamedDeclaration(_type) ? _type.declaration as t.TSTypeAliasDeclaration : _type;
    const params = ast.declarator.initializer.params.map((param) => {
        const constraint = param.constraint ? TSType(param.constraint) : null;
        const tsParam = t.tSTypeParameter(constraint, /* TODO */null, (param as ITypeReference).typeName.name)
        return tsParam;
    });

    type.typeParameters = t.tsTypeParameterDeclaration(params);
    return _type;
}

export function TSTypeAliasDeclaration(ast: IDeclaration): t.TSTypeAliasDeclaration | t.ExportNamedDeclaration {
    const declarator = ast.declarator;
    const declaraion = t.tsTypeAliasDeclaration(Identifier(declarator.name), null, TSType(declarator.initializer));

    if (ast.export) {
        return t.exportNamedDeclaration(declaraion);
    } else {
        return declaraion;
    }
}

function tsConditionalType(ast: ITypeIfStatement): t.TSConditionalType {
    const { condition, consequent, alternate } = ast;
    const falseType = alternate.kind === "TypeIfStatement" ? tsConditionalType(alternate) : TSType(alternate.argument);
    const type = t.tsConditionalType(TSType(condition.checkType), TSType(condition.extendsType), TSType(consequent.argument), falseType);
    return type;
}

function tsPropertySignature(ast: ITypeObjectProperty) {
    const key = Identifier(ast.name);
    const value = TSType(ast.value);
    const prop = t.tsPropertySignature(key, t.tsTypeAnnotation(value));
    return {
        ...prop,
        readonly: ast.readonly,
        optional: ast.optional
    } as t.TSPropertySignature;
}

function tsTypeLiteral(ast: IObjectType) {
    const props = ast.props.map(each => {
        switch (each.kind) {
            case "TypeObjectProperty": {
                return tsPropertySignature(each);
            }
            case "TypeSpreadProperty": {
                if (each.param.kind === "TypeReference") {
                    const type = TSType(each.param) as t.TSTypeReference;
                    return type;
                } else if (each.param.kind === "TypeCallExpression") {
                    const typeName = Identifier(each.param.callee.typeName);
                    const params = each.param.params.map(each => {
                        if (each.kind === "TypeReference") {
                            return TSType(each);
                        }

                        throw new Error(`unkonwn param: ${JSON.stringify(each, null, 4)}`);
                    })
                    const typeReference = t.tsTypeReference(typeName, t.tsTypeParameterInstantiation(params));
                    return typeReference;
                }
            }
        }
    });

    const isSpread = ast.props.some(prop => prop.kind === "TypeSpreadProperty");
    if (isSpread) {
        const tsTypeProps = props.map(each => {
            if (t.isTSPropertySignature(each)) {
                return t.tsTypeLiteral([each]);
            } else {
                return each;
            }
        });
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

function tsIndexedAccessType(head: ITypeExpression, members: ITypeExpression[]): t.TSIndexedAccessType {
    const indexType = TSType(members[members.length - 1]);
    if (members.length === 1) {
        const type = t.tsIndexedAccessType(TSType(head), indexType);
        return type;
    } else {
        const rest = members.slice(0, members.length - 1);
        const objectType = tsIndexedAccessType(head, rest);
        return t.tsIndexedAccessType(objectType, indexType);
    }
}

function tsIndexType(ast: IIndexType): t.TSIndexedAccessType {
    return tsIndexedAccessType(ast.head, ast.members);
}

function _tsArrayType(elementType: t.TSType, dimension: number) {
    if (dimension === 1) {
        return t.tsArrayType(elementType);
    } else {
        return t.tsArrayType(_tsArrayType(elementType, dimension - 1));
    }
}

function tsArrayType(ast: IArrayType): t.TSArrayType {
    return _tsArrayType(TSType(ast.elementType), ast.dimension);
}

function tsFunctionType(ast: IFunctionType): t.TSFunctionType {
    const params = ast.params.map(each => {
        return {
            ...Identifier(each.name),
            typeAnnotation: t.tsTypeAnnotation(TSType(each.type))
        } as t.Identifier /** TODO: use t.identifier to create it */
    });

    return t.tsFunctionType(null, params, t.tsTypeAnnotation(TSType(ast.returnType)));
}


function resolveMappedTypeAsClause(as: ITypeObjectProperty, key: IIdentifier) {
    if (as.value.kind === "TypeReference" && as.value.typeName.name === key.name) {
        return null;
    }
    return TSType(as.value);
}

function tsMappedType(ast: ITypeForInStatement): t.TSMappedType {
    const { as, key, keys, value } = ast;
    const typeParam = t.tsTypeParameter(TSType(keys), null, key.name);
    const nameType = resolveMappedTypeAsClause(as, key);
    const type = t.tsMappedType(typeParam, TSType(value), nameType);
    return {
        ...type,
        readonly: as.readonly,
        optional: as.optional
    } as t.TSMappedType;
}

function tsTypeOperator(ast: IOperatorType, operator: string): t.TSTypeOperator {
    return {
        ...t.tsTypeOperator(TSType(ast.operand)),
        operator
    }  /** TODO: use t.tsTypeOperator to create it? */
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
    Kind<T> extends Kind<IAnyType> ? t.TSAnyKeyword :
    Kind<T> extends Kind<INumberType> ? t.TSNumberKeyword :
    Kind<T> extends Kind<IObjectType> ? t.TSTypeLiteral :
    Kind<T> extends Kind<ITupleType> ? t.TSTupleType :
    Kind<T> extends Kind<IArrayType> ? t.TSArrayType :
    /**
     */
    Kind<T> extends Kind<ITypeReference> ? t.TSTypeReference :
    Kind<T> extends Kind<IInferType> ? t.TSInferType :
    Kind<T> extends Kind<IUnionType> ? t.TSUnionType :
    Kind<T> extends Kind<IIntersectionType> ? t.TSIntersectionType :
    Kind<T> extends Kind<IKeyOfType> ? t.TSTypeOperator :
    Kind<T> extends Kind<IReadonlyArray> ? t.TSTypeOperator :
    Kind<T> extends Kind<IReadonlyTuple> ? t.TSTypeOperator :
    Kind<T> extends Kind<IIndexType> ? t.TSIndexedAccessType :
    Kind<T> extends Kind<IFunctionType> ? t.TSFunctionType :
    Kind<T> extends Kind<ITypeArrowFunctionExpression> ? t.TSConditionalType :
    Kind<T> extends Kind<IConditionalTypeExpression> ? t.TSConditionalType :
    Kind<T> extends Kind<IMappedTypeExpression> ? t.TSMappedType :
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
        case "AnyType": return t.tsAnyKeyword();
        case "VoidType": return t.tsVoidKeyword();
        case "NumberType": return t.tsNumberKeyword();
        case "ObjectType": return tsTypeLiteral(ast);
        case "TupleType": return t.tsTupleType(ast.items.map(item => TSType(item)));
        case "ArrayType": return tsArrayType(ast);
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
        case "MappedTypeExpression": return tsMappedType(ast.body);
        case "UnionType": return t.tsUnionType(ast.types.map(each => TSType(each)));
        case "IntersectionType": return t.tsIntersectionType(ast.types.map(each => TSType(each)));
        case "KeyOfType": return tsTypeOperator(ast, "keyof");
        case "ReadonlyArray": return tsTypeOperator(ast, "readonly");
        case "ReadonlyTuple": return tsTypeOperator(ast, "readonly");
        case "IndexType": return tsIndexType(ast);
        case "FunctionType": return tsFunctionType(ast);
        case "RestType": return t.tsRestType(TSType(ast.param));

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

const TypeLibFunction = {
    Object: {
        Assign: "object$assign",
    }
}