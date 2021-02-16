import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { IBasicType, BasicType, ITypeReference, TypeReference, IIdentifier, Identifier } from "../basic";
import { ITypeIfStatement, TypeIfStatement } from "../statement";
import { FunctionType, IFunctionType } from "../function";

export type ITypeExpression =
    | IBasicType
    | ITypeReference
    | ITypeCallExpression
    | IInferType
    | ITypeArrowFunctionExpression
    | IConditionalTypeExpression
    | IUnionType
    | IOperatorType
    | IIndexType
    | IFunctionType

export function TypeExpression() {
    return (
        <or>
            <FunctionType/>
            <OperatorType />
            <IndexType />
            <UnionType />
            <ConditionalTypeExpression />
            <TypeArrowFunctionExpression />
            <TypeCallExpression />
            <BasicType />
            <InferType />
            <TypeReference />
        </or>
    )
}

export interface ITypeArrowFunctionExpression {
    kind: "TypeArrowFunctionExpression"
    params: IParamList
    body: IConditionalTypeExpression
}

/**
 * TODO: add more expressions? use block statement?
 */
export function TypeArrowFunctionExpression() {
    const action = ({ params, body }) => {
        return {
            kind: "TypeArrowFunctionExpression",
            params,
            body
        }
    }

    return (
        <pattern action={action}>
            {Text("(")}
            <ParamList label="params" />
            {Text(")")}
            {Text("=>")}
            {/* <or label="body"> */}
            <TypeExpression label="body" />
            {/* <TypeBlockStatement />
            </or> */}
        </pattern>
    )
}

export interface IConditionalTypeExpression {
    kind: "ConditionalTypeExpression"
    body: ITypeIfStatement
}

export function ConditionalTypeExpression() {
    const action = ({ statement }): IConditionalTypeExpression => {
        return {
            kind: "ConditionalTypeExpression",
            body: statement
        }
    }

    return (
        <pattern action={action}>
            {Text("^{")}
            <TypeIfStatement label="statement" />
            {Text("}")}
        </pattern>
    )
}

export interface ITypeCallExpression {
    kind: "TypeCallExpression"
    callee: ITypeReference
    params: IParamList
}

export function TypeCallExpression() {
    const action = ({ callee, params }): ITypeCallExpression => {
        return {
            kind: "TypeCallExpression",
            callee,
            params
        }
    }

    return (
        <pattern action={action}>
            <_ />
            <TypeReference label="callee" />
            {Text("<")}
            <ParamList label="params" />
            {Text(">")}
            <_ />
        </pattern>
    )
}

export type ITypeExpressionList = ITypeExpression[];

export function TypeExpressionList() {
    return (
        <pattern action={({ head, tail }): IParamList => head ? [head, ...tail] : []}>
            <opt label="head">
                <TypeExpression />
            </opt>
            <repeat type="*" label="tail">
                <pattern action={({ param }) => param}>
                    {Text(",")}
                    <TypeExpression label="param" />
                </pattern>
            </repeat>
        </pattern>
    )
}

export type IParamList = ITypeExpressionList

export function ParamList() {
    return (
        <TypeExpressionList />
    )
}

export interface IInferType {
    kind: "InferType"
    typeName: IIdentifier
}

export function InferType() {
    const action = ({ typeName }): IInferType => {
        return {
            kind: "InferType",
            typeName
        }
    }
    return (
        <pattern action={action}>
            {Text("infer")}
            <Identifier label="typeName" />
        </pattern>
    )
}

export interface IUnionType {
    kind: "UnionType"
    types: ITypeExpression[]
}

export function UnionType() {
    const action = ({ types }): IUnionType => {
        return {
            kind: "UnionType",
            types
        }
    }

    return (
        <pattern action={action}>
            <repeat type="+" label="types">
                <pattern action={({ type }) => type}>
                    {Text("|")}
                    <TypeExpression label="type" />
                </pattern>
            </repeat>
        </pattern>
    )
}

export type IOperatorType = IKeyOfType

export function OperatorType() {
    return (
        <KeyOfType />
    )
}

export interface IKeyOfType {
    kind: "KeyOfType"
    operand: ITypeExpression
}

export function KeyOfType() {
    const action = ({ operand }): IKeyOfType => {
        return {
            kind: "KeyOfType",
            operand
        }
    }

    return (
        <pattern action={action}>
            {Text("keyof")}
            <TypeExpression label="operand" />
        </pattern>
    )
}

export interface IIndexType {
    kind: "IndexType"
    head: ITypeExpression
    members: ITypeExpression[]
}

function IndexTypeHead() {
    const typeExpression = TypeExpression();
    typeExpression.children = typeExpression.children.filter((child: { rule: Function }) => child.rule !== IndexType);
    return typeExpression;
}

export function IndexType() {
    const action = ({ head, members }): IIndexType => {
        return {
            kind: "IndexType",
            head,
            members
        }
    }

    return (
        <pattern action={action}>
            <IndexTypeHead label="head" />
            <repeat type="+" label="members">
                <pattern action={({ indexType }) => indexType}>
                    {Text("[")}
                    <TypeExpression label="indexType" />
                    {Text("]")}
                </pattern>
            </repeat>
        </pattern>
    )
}