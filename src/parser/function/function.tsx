import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { Identifier, IIdentifier } from "../basic";
import { ITypeExpression, TypeExpression } from "../expression";

export interface IFunctionType {
    kind: "FunctionType"
    params: IFunctionTypeParam[]
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
    rest?: boolean
}

export function FunctionTypeParam() {
    const action = ({ name, type, rest }): IFunctionTypeParam => {
        const param: IFunctionTypeParam = {
            kind: "FunctionTypeParam",
            name,
            type
        }

        if (rest) {
            param.rest = true
        }

        return param
    }

    return (
        <pattern action={action}>
            <_ />
            <opt label="rest">
                <text>...</text>
            </opt>
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