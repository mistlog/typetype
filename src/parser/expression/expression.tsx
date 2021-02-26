import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { IBasicType, BasicType, ITypeReference, TypeReference, IIdentifier, Identifier, IArrayType, ArrayType, ITupleType, TupleType } from "../basic";
import { ITypeForInStatement, ITypeIfStatement, TypeForInStatement, TypeIfStatement } from "../statement";
import { FunctionType, IFunctionType } from "../function";

export type ITypeExpression =
    | IBasicType
    | ITypeReference
    | ITypeCallExpression
    | IInferType
    | ITypeArrowFunctionExpression
    | IConditionalTypeExpression
    | IMappedTypeExpression
    | IUnionType
    | IIntersectionType
    | IOperatorType
    | IIndexType
    | IFunctionType

export function TypeExpression() {
    return (
        <or>
            <FunctionType />
            <OperatorType />
            <IndexType />
            <UnionType />
            <IntersectionType />
            <ConditionalTypeExpression />
            <MappedTypeExpression />
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
        <pattern action={({ head, tail }): ITypeExpressionList => head ? [head, ...tail] : []}>
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

export type IITypeExpressionWithConstraint = ITypeExpression & { constraint?: ITypeExpression }
export type IParamList = IITypeExpressionWithConstraint[]

export function ParamList() {
    const action = ({ head, tail }): IParamList => head ? [head, ...tail] : [];
    const actionReturnParam = ({ param, constraint }) => {
        return constraint ? { ...param, constraint } : param
    }

    const paramWithConstraint = () => {
        return (
            <list>
                <TypeExpression label="param" />
                <opt label="constraint">
                    <pattern action={({ expression }) => expression}>
                        {Text("extends")}
                        <TypeExpression label="expression" />
                    </pattern>
                </opt>
            </list>
        )
    }

    return (
        <pattern action={action}>
            <opt label="head">
                <pattern action={actionReturnParam}>
                    {paramWithConstraint()}
                </pattern>
            </opt>
            <repeat type="*" label="tail">
                <pattern action={actionReturnParam}>
                    {Text(",")}
                    {paramWithConstraint()}
                </pattern>
            </repeat>
        </pattern>
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
            <or>
                {Text("|")}
                {Text("union")}
            </or>
            {Text("[")}
            <TypeExpressionList label="types" />
            {Text("]")}
        </pattern>
    )
}

export interface IIntersectionType {
    kind: "IntersectionType"
    types: ITypeExpression[]
}

export function IntersectionType() {
    const action = ({ types }): IIntersectionType => {
        return {
            kind: "IntersectionType",
            types
        }
    }

    /** An intersection type combines multiple types into one */
    return (
        <pattern action={action}>
            <or>
                {Text("&")}
                {Text("combine")}
            </or>
            {Text("[")}
            <TypeExpressionList label="types" />
            {Text("]")}
        </pattern>
    )
}

export type IOperatorType = IKeyOfType | IReadonlyArray | IReadonlyTuple

export function OperatorType() {
    return (
        <or>
            <KeyOfType />
            <ReadonlyArray />
            <ReadonlyTuple />
        </or>
    )
}

export interface IReadonlyTuple {
    kind: "ReadonlyTuple"
    operand: ITupleType
}

export function ReadonlyTuple() {
    const action = ({ operand }): IReadonlyTuple => {
        return {
            kind: "ReadonlyTuple",
            operand
        }
    }

    return (
        <pattern action={action}>
            {Text("readonly")}
            <TupleType label="operand" />
        </pattern>
    )
}

export interface IReadonlyArray {
    kind: "ReadonlyArray"
    operand: IArrayType
}

export function ReadonlyArray() {
    const action = ({ operand }): IReadonlyArray => {
        return {
            kind: "ReadonlyArray",
            operand
        }
    }

    return (
        <pattern action={action}>
            {Text("readonly")}
            <ArrayType label="operand" />
        </pattern>
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

export interface IMappedTypeExpression {
    kind: "MappedTypeExpression"
    body: ITypeForInStatement
}

export function MappedTypeExpression() {
    const action = ({ statement }): IMappedTypeExpression => {
        return {
            kind: "MappedTypeExpression",
            body: statement
        }
    }

    return (
        <pattern action={action}>
            {Text("^{")}
            <TypeForInStatement label="statement" />
            {Text("}")}
        </pattern>
    )
}