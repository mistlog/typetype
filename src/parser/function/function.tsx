import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { Identifier, IIdentifier } from "../basic";
import { ITypeExpression, TypeExpression } from "../expression";

export interface IFunctionType {
    kind: "FunctionType"
    params: ITypeExpression[]
    returnType: ITypeExpression
}

export function FunctionType() {
    const action = ({ params, returnType }): IFunctionType => {
        return {
            kind: "FunctionType",
            params,
            returnType
        }
    }

    return (
        <pattern action={action}>
            {Text("type")}
            {Text("(")}
            <FunctionTypeParamList label="params" />
            {Text(")")}
            {Text("=>")}
            <TypeExpression label="returnType" />
        </pattern>
    )
}

export function FunctionTypeParamList() {
    const action = ({ head, tail }) => {
        return head ? [head, ...tail] : []
    }

    return (
        <pattern action={action}>
            <opt label="head">
                <FunctionTypeParam />
            </opt>
            <repeat type="*" label="tail">
                <pattern action={({ param }) => param}>
                    {Text(",")}
                    <FunctionTypeParam label="param" />
                </pattern>
            </repeat>
        </pattern>
    )
}

export interface IFunctionTypeParam {
    kind: "FunctionTypeParam"
    name: IIdentifier
    type: ITypeExpression
}

export function FunctionTypeParam() {
    const action = ({ name, type }): IFunctionTypeParam => {
        return {
            kind: "FunctionTypeParam",
            name,
            type
        }
    }

    return (
        <pattern action={action}>
            <_ />
            <Identifier label="name" />
            <opt label="type">
                <pattern action={({ expression }) => expression}>
                    {Text(":")}
                    <TypeExpression label="expression" />
                </pattern>
            </opt>
            <_ />
        </pattern>
    )
}