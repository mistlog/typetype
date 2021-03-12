import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { Identifier, IIdentifier } from "../basic";
import { IParamList, ITypeExpression, ParamList, TypeExpression } from "../expression";

export interface IFunctionType {
    kind: "FunctionType"
    params: IFunctionTypeParam[]
    returnType: ITypeExpression
    typeParams?: IParamList
}

export function FunctionType() {
    const action = ({ params, returnType, typeParams }): IFunctionType => {
        const type: IFunctionType = {
            kind: "FunctionType",
            params,
            returnType
        }
        if (typeParams) {
            type.typeParams = typeParams
        }
        return type
    }

    return (
        <pattern action={action}>
            {Text("type")}
            <_ />
            <opt label="typeParams">
                <pattern action={({ typeParams }) => typeParams}>
                    {Text("<")}
                    <ParamList label="typeParams" />
                    <text>{">"}</text>
                </pattern>
            </opt>
            <text>(</text>
            <_ />
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
    optional?: boolean
}

export function FunctionTypeParam() {
    const action = ({ name, type, rest, optional }): IFunctionTypeParam => {
        const param: IFunctionTypeParam = {
            kind: "FunctionTypeParam",
            name,
            type
        }

        if (rest) {
            param.rest = true
        }

        if (optional) {
            param.optional = true
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
            <opt label="optional">
                {Text("?")}
            </opt>
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