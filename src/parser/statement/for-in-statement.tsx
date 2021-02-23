import { ReactPeg } from "react-peg";
import { Identifier, IIdentifier, IObjectType, ITypeObjectProperty } from "../basic";
import { _, Text } from "../common";
import { ITypeExpression, TypeExpression } from "../expression";
import { ITypeReturnStatement, TypeReturnStatement } from "./statement";

export interface ITypeForInStatement {
    kind: "TypeForInStatement"
    key: IIdentifier
    keys: ITypeExpression
    as: ITypeObjectProperty
    value: ITypeExpression
}

function findProp(obj: IObjectType, name: string) {
    return obj.props.find(prop => prop.kind === "TypeObjectProperty" && prop.name.name === name) as ITypeObjectProperty;
}

export function TypeForInStatement() {
    const action = ({ key, keys, returnType }: { key: IIdentifier, keys: ITypeExpression, returnType: ITypeReturnStatement }): ITypeForInStatement => {
        // TODO: returnType must be object type { key: ..., value: ... }
        const pair = returnType.argument as IObjectType;

        // may be used in as clause
        const as = findProp(pair, "key");
        const value = findProp(pair, "value").value;

        return {
            kind: "TypeForInStatement",
            key,
            keys,
            as,
            value
        }
    }

    return (
        <pattern action={action}>
            {Text("for")}
            {Text("(")}
            <Identifier label="key" />
            {Text("in")}
            <TypeExpression label="keys" />
            {Text(")")}
            {Text("{")}
            <TypeReturnStatement label="returnType" />
            {Text("}")}
        </pattern>
    )
}