import { ReactPeg } from "react-peg"
import { TypeFunctionDeclaration, TypeVariableDeclaration, ITypeVariableDeclaration, ITypeFunctionDeclaration } from "../declaration"

export interface ITypeFile {
    kind: "TypeFile"
    body: (ITypeVariableDeclaration | ITypeFunctionDeclaration)[]
}

export function TypeFile() {
    const action = ({ body }): ITypeFile => {
        return {
            kind: "TypeFile",
            body
        }
    }

    return (
        <pattern action={action}>
            <repeat type="+" label="body">
                <or>
                    <TypeVariableDeclaration />
                    <TypeFunctionDeclaration />
                </or>
            </repeat>
        </pattern>
    )
}