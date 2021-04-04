import { ReactPeg } from "react-peg"
import { TypeFunctionDeclaration, TypeVariableDeclaration, ITypeVariableDeclaration, ITypeFunctionDeclaration, ImportDeclaration, IImportDeclaration } from "../declaration"

export interface ITypeFile {
    kind: "TypeFile"
    body: IDeclaration[]
}

export type IDeclaration = ITypeVariableDeclaration | ITypeFunctionDeclaration | IImportDeclaration;

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
                    <ImportDeclaration />
                    <TypeVariableDeclaration />
                    <TypeFunctionDeclaration />
                </or>
            </repeat>
        </pattern>
    )
}