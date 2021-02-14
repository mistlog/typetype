import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
import { ITypeExpression, TypeExpression } from "../expression";
import { TypeReturnStatement, ITypeReturnStatement } from "./statement";

export interface ITypeIfStatement {
    kind: "TypeIfStatement"
    condition: IExtendsClause
    consequent: ITypeReturnStatement
    alternate: ITypeReturnStatement | ITypeIfStatement
}

export function TypeIfStatement() {
    const action = ({ condition, consequent, alternate }) => {
        return {
            kind: "TypeIfStatement",
            condition,
            consequent,
            alternate
        }
    }

    return (
        <pattern action={action}>
            {Text("if")}
            {Text("(")}
            <ExtendsClause label="condition" />
            {Text(")")}
            {Text("{")}
            <TypeReturnStatement label="consequent" />
            {Text("}")}
            {Text("else")}
            <or label="alternate">
                <TypeIfStatement />
                <pattern action={({ statement }) => statement}>
                    {Text("{")}
                    <TypeReturnStatement label="statement" />
                    {Text("}")}
                </pattern>
            </or>
        </pattern>
    )
}

export interface IExtendsClause {
    kind: "ExtendsClause"
    checkType: ITypeExpression
    extendsType: ITypeExpression
}
export function ExtendsClause() {
    const action = ({ checkType, extendsType }) => {
        return {
            kind: "ExtendsClause",
            checkType,
            extendsType
        }
    }

    return (
        <pattern action={action}>
            <_ />
            <TypeExpression label="checkType" />
            {Text("extends")}
            <TypeExpression label="extendsType" />
            <_ />
        </pattern>
    )
}