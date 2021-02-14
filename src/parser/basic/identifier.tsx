import { ReactPeg } from "react-peg";
import { _ } from "../common";

/**
 * identifier:
        identifier-nondigit
        identifier identifier-nondigit
        identifier digit
 */
export interface IIdentifier {
    kind: "Identifier"
    name: string
}

export function Identifier() {
    const head = (
        <IdentifierNonDigit />
    )

    const tail = (
        <repeat type="*">
            <or>
                <Identifier />
                <Digit />
            </or>
        </repeat>
    )

    const action = ({ globalFunction }): IIdentifier => {
        const name = globalFunction.text().trim();
        return {
            kind: "Identifier",
            name
        }
    }

    return (
        <pattern action={action}>
            {head}
            {tail}
        </pattern>
    )
}

/**
 * identifier-nondigit:
        nondigit
        universal-character-name
        other implementation-defined characters
 */
export function IdentifierNonDigit() {
    return (
        <NonDigit />
    )
}

/**
 * nondigit: one of
        a b c d e f g h i j k l m
        n o p q r s t u v w x y z
        A B C D E F G H I J K L M
        N O P Q R S T U V W X Y Z _
 */
export function NonDigit() {
    return (
        <set label="nonDigit">a-zA-Z_</set>
    )
}

/**
 * one of
        0 1 2 3 4 5 6 7 8 9
 */
export function Digit() {
    return (
        <set label="digit">0-9</set>
    )
}
