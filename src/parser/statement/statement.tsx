import { ReactPeg } from "react-peg";
import { _, Text } from "../common";
// import { ITypeIfStatement, TypeIfStatement } from "./if-statement";
import { ITypeExpression, TypeExpression } from "../expression";

// export interface ITypeBlockStatement {
//     kind: "TypeBlockStatement"
//     body: (ITypeIfStatement)[]
// }

// export function TypeBlockStatement() {
//     const action = ({ statement }) => {
//         return {
//             kind: "TypeBlockStatement",
//             body: [
//                 statement
//             ]
//         }
//     }
//     return (
//         <pattern action={action}>
//             {Text("{")}
//             <TypeIfStatement label="statement" />
//             {Text("}")}
//         </pattern>
//     )
// }

export interface ITypeReturnStatement {
    kind: "TypeReturnStatement"
    argument: ITypeExpression
}

export function TypeReturnStatement() {
    const action = ({ arg }) => {
        return {
            kind: "TypeReturnStatement",
            argument: arg
        }
    }

    return (
        <pattern action={action}>
            {Text("return")}
            <TypeExpression label="arg" />
        </pattern>
    )
}
