import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { Identifier, IIdentifier } from "./identifier";
import { SourceCharacter, String } from "./string";
import { ITypeExpression, TypeExpression, ITypeExpressionList, TypeExpressionList } from "../expression";

export type IBasicType =
    | ITypeLiteral
    | IStringType
    | INeverType
    | IAnyType
    | INumberType
    | ITupleType
    | IArrayType
    | IVoidType

export function BasicType() {
    return (
        <or>
            <ArrayType />
            <NeverType />
            <AnyType />
            <VoidType />
            <NumberType />
            <StringType />
            <TupleType />
            <TypeLiteral />
        </or>
    )
}

export interface IStringType {
    kind: "StringType"
    value: "string"
}

export function StringType() {
    const action = () => {
        return {
            kind: "StringType",
            value: "string"
        }
    }
    return (
        <pattern action={action}>
            {Text("string")}
        </pattern>
    )
}

export type ITypeLiteral = IObjectTypeLiteral | IStringTypeLiteral | INumberTypeLiteral | ITemplateTypeLiteral | IBooleanTypeLiteral

export function TypeLiteral() {
    return (
        <or>
            <ObjectTypeLiteral />
            <NumberTypeLiteral />
            <StringTypeLiteral />
            <BooleanTypeLiteral />
            <TemplateTypeLiteral />
        </or>
    )
}

export interface ITemplateTypeLiteral {
    kind: "TemplateTypeLiteral"
    items: (ITemplateElement | ITemplateExpression)[]
}

export function TemplateTypeLiteral() {
    const action = ({ items }): ITemplateTypeLiteral => {
        return {
            kind: "TemplateTypeLiteral",
            items
        }
    }

    return (
        <pattern action={action}>
            <_ />
            <text>`</text>
            <repeat type="*" label="items">
                <or>
                    <TemplateElement />
                    <TemplateExpression />
                </or>
            </repeat>
            <text>`</text>
            <_ />
        </pattern>
    )
}

export interface ITemplateElement {
    kind: "TemplateElement"
    value: string
}

export function TemplateElement() {
    const action = ({ value }): ITemplateElement => {
        return {
            kind: "TemplateElement",
            value
        }
    }
    return (
        <pattern action={action}>
            <TemplateCharSequence label="value" />
        </pattern>
    )
}

export interface ITemplateExpression {
    kind: "TemplateExpression"
    expression: ITypeExpression
}

export function TemplateExpression() {
    const action = ({ expression }): ITemplateExpression => {
        return {
            kind: "TemplateExpression",
            expression
        }
    }
    return (
        <pattern action={action}>
            <text>$</text>
            <text>{`{`}</text>
            <_ />
            <TypeExpression label="expression" />
            <_ />
            <text>{`}`}</text>
        </pattern>
    )
}

export function TemplateCharSequence() {
    return (
        <pattern action={({ chars }) => chars.join("")}>
            <repeat type="+" label="chars">
                <TemplateChar />
            </repeat>
        </pattern>
    )
}

export function TemplateChar() {
    return (
        <pattern action={({ char }) => char}>
            <assert type="without">
                <or>
                    <text>`</text>
                    <text>$</text>
                </or>
            </assert>
            <or label="char">
                <text>\\`</text>
                <SourceCharacter label="char" />
            </or>
        </pattern>
    )
}

export interface INumberTypeLiteral {
    kind: "NumberTypeLiteral"
    value: number
}

export function NumberTypeLiteral() {
    const action = ({ value }) => {
        return {
            kind: "NumberTypeLiteral",
            value
        }
    }

    return (
        <pattern action={action}>
            <Number label="value" />
        </pattern>
    )
}

export function Number() {
    const digits = (
        <repeat type="+">
            <set>0-9</set>
        </repeat>
    );

    const action = ({ globalFunction }) => {
        return parseFloat(globalFunction.text());
    }

    return (
        <pattern action={action}>
            {digits}
            <opt>
                <text>.</text>
                {digits}
            </opt>
        </pattern>
    );
}

export interface IStringTypeLiteral {
    kind: "StringTypeLiteral"
    value: string
}

export function StringTypeLiteral() {
    const action = ({ value }) => {
        return {
            kind: "StringTypeLiteral",
            value
        }
    }
    return (
        <pattern action={action}>
            <String label="value" />
        </pattern>
    )
}

export interface IBooleanTypeLiteral {
    kind: "BooleanTypeLiteral"
    value: boolean
}

export function BooleanTypeLiteral() {
    const action = ({ value }): IBooleanTypeLiteral => {
        return {
            kind: "BooleanTypeLiteral",
            value: value === "true" ? true : false
        }
    }

    return (
        <pattern action={action}>
            <or label="value">
                <text>true</text>
                <text>false</text>
            </or>
        </pattern>
    )
}

export interface INumberType {
    kind: "NumberType"
    value: "number"
}

export function NumberType() {
    const action = () => {
        return {
            kind: "NumberType",
            value: "number"
        }
    }
    return (
        <pattern action={action}>
            {Text("number")}
        </pattern>
    )
}

export interface INeverType {
    kind: "NeverType"
    value: "never"
}

export function NeverType() {
    const action = () => {
        return {
            kind: "NeverType",
            value: "never"
        }
    }
    return (
        <pattern action={action}>
            {Text("never")}
        </pattern>
    )
}

export interface IAnyType {
    kind: "AnyType"
    value: "any"
}

export function AnyType() {
    const action = (): IAnyType => {
        return {
            kind: "AnyType",
            value: "any"
        }
    }
    return (
        <pattern action={action}>
            {Text("any")}
        </pattern>
    )
}

export interface IVoidType {
    kind: "VoidType"
    value: "void"
}

export function VoidType() {
    const action = () => {
        return {
            kind: "VoidType",
            value: "void"
        }
    }
    return (
        <pattern action={action}>
            {Text("void")}
        </pattern>
    )
}

export interface ITupleType {
    kind: "TupleType"
    items: ITypeExpressionList
}

export function TupleType() {
    const action = ({ items }): ITupleType => {
        return {
            kind: "TupleType",
            items
        }
    }
    return (
        <pattern action={action}>
            {Text("[")}
            <TypeExpressionList label="items" />
            {Text("]")}
        </pattern>
    )
}

export interface IObjectTypeLiteral {
    kind: "ObjectTypeLiteral"
    props: (ITypeObjectProperty | ITypeSpreadProperty)[]
}

export function ObjectTypeLiteral() {
    const action = ({ head, tail }): IObjectTypeLiteral => {
        return {
            kind: "ObjectTypeLiteral",
            props: head ? [head, ...tail] : []
        }
    }

    return (
        <pattern action={action}>
            {Text("{")}
            <opt label="head">
                <Member />
            </opt>
            <repeat type="*" label="tail">
                <pattern action={({ member }) => member}>
                    {Text(",")}
                    <Member label="member" />
                </pattern>
            </repeat>
            {Text("}")}
        </pattern>
    )
}

function Member() {
    return (
        <or>
            <TypeObjectProperty />
            <TypeSpreadProperty />
        </or>
    )
}

export interface ITypeSpreadProperty {
    kind: "TypeSpreadProperty"
    param: ITypeExpression
}

export function TypeSpreadProperty() {
    const action = ({ prop }: { prop: IRestType }): ITypeSpreadProperty => {
        return {
            kind: "TypeSpreadProperty",
            param: prop.param
        }
    }

    return (
        <pattern action={action}>
            <RestType label="prop" />
        </pattern>
    )
}

export interface IRestType {
    kind: "RestType"
    param: ITypeExpression
}

export function RestType() {
    const action = ({ param }): IRestType => {
        return {
            kind: "RestType",
            param
        }
    }

    return (
        <pattern action={action}>
            <_ />
            {Text("...")}
            <TypeExpression label="param" />
            <_ />
        </pattern>
    )
}

export interface ITypeObjectProperty {
    kind: "TypeObjectProperty"
    name: IIdentifier
    value: ITypeExpression
    readonly: boolean
    optional: boolean
}

export function TypeObjectProperty() {
    const action = ({ name, value: rawValue, optional, readonly }): ITypeObjectProperty => {
        const value = rawValue || /** shorthand */ {
            kind: "TypeReference",
            typeName: { ...name }
        } as ITypeReference

        return {
            kind: "TypeObjectProperty",
            name,
            value,
            optional: Boolean(optional),
            readonly: Boolean(readonly)
        }
    }

    return (
        <pattern action={action}>
            <_ />
            <opt label="readonly">
                {Text("readonly")}
            </opt>
            <Identifier label="name" />
            <opt label="optional">
                {Text("?")}
            </opt>
            <opt label="value">
                <pattern action={({ expression }) => expression}>
                    {Text(":")}
                    <TypeExpression label="expression" />
                </pattern>
            </opt>
            <_ />
        </pattern>
    )
}

export interface ITypeReference {
    kind: "TypeReference"
    typeName: IIdentifier
}

export function TypeReference() {
    const action = ({ typeName }): ITypeReference => {
        return {
            kind: "TypeReference",
            typeName
        }
    }
    return (
        <pattern action={action}>
            <Identifier label="typeName" />
        </pattern>
    )
}

export interface IArrayType {
    kind: "ArrayType"
    elementType: ITypeExpression
    dimension: number
}

function ArrayElementType() {
    const basicType = BasicType();
    basicType.children = basicType.children.filter((child: { rule: Function }) => child.rule !== ArrayType);
    return basicType;
}

export function ArrayType() {
    const action = ({ elementType, members }): IArrayType => {
        return {
            kind: "ArrayType",
            elementType,
            dimension: members.length
        }
    }

    return (
        <pattern action={action}>
            <ArrayElementType label="elementType" />
            <repeat type="+" label="members">
                {Text("[")}
                {Text("]")}
            </repeat>
        </pattern>
    )
}