import { ReactPeg } from "react-peg";
import { Text } from "../common";
import { Identifier, IIdentifier } from "../basic";
import { TypeExpression, ITypeExpression, ITypeArrowFunctionExpression, TypeArrowFunctionExpression } from "../expression";

//
export interface ITypeFunctionDeclaration {
    kind: "TypeFunctionDeclaration"
    declarator: ITypeFunctionDeclarator
}

export type IDeclarator = ITypeFunctionDeclarator | ITypeVariableDeclarator;

export function TypeFunctionDeclaration() {
    const action = ({ declarator }) => {
        return {
            kind: "TypeFunctionDeclaration",
            declarator
        }
    }

    return (
        <pattern action={action}>
            {Text("type")}
            {Text("function")}
            <TypeFunctionDeclarator label="declarator" />
        </pattern>
    )
}

export interface ITypeFunctionDeclarator {
    name: IIdentifier
    initializer: IFunctionInitializer
}

type IFunctionInitializer = ITypeArrowFunctionExpression

export function TypeFunctionDeclarator() {
    const action = ({ name, initializer }) => {
        return {
            kind: "TypeFunctionDeclarator",
            name,
            initializer
        }
    }

    return (
        <pattern action={action}>
            <Identifier label="name" />
            {Text("=")}
            <TypeArrowFunctionExpression label="initializer" />
        </pattern>
    )
}

//
export interface ITypeVariableDeclaration {
    kind: "TypeVariableDeclaration"
    declarator: ITypeVariableDeclarator
}

export function TypeVariableDeclaration() {
    const action = ({ declarator }) => {
        return {
            kind: "TypeVariableDeclaration",
            declarator
        }
    }

    return (
        <pattern action={action}>
            {Text("type")}
            <TypeVariableDeclarator label="declarator" />
        </pattern>
    )
}

export interface ITypeVariableDeclarator {
    name: IIdentifier
    initializer: IInitializer
}

export function TypeVariableDeclarator() {
    const action = ({ name, initializer }) => {
        return {
            kind: "TypeVariableDeclarator",
            name,
            initializer
        }
    }

    return (
        <pattern action={action}>
            <Identifier label="name" />
            {Text("=")}
            <Initializer label="initializer" />
        </pattern>
    )
}

export type IInitializer = ITypeExpression

export function Initializer() {
    return (
        <TypeExpression />
    )
}
