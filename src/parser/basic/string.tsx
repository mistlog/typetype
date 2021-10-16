import { ReactPeg } from "react-peg";
import { _ } from "../common";

export function SourceCharacter() {
    return (
        <any />
    )
}

export function Source() {
    const action = ({ chars }) => {
        return chars.map((each: [undefined, string]) => each[1]).join("");
    }

    return (
        <pattern action={action}>
            <repeat type="*" label="chars">
                <assert type="without">
                    <text>```</text>
                </assert>
                <SourceCharacter />
            </repeat>
        </pattern>

    )
}

/**
 * string-literal:
       encoding-prefixopt" s-char-sequenceopt"
       encoding-prefixoptR raw-string
 */
export function String() {
    const action = ({ chars }) => {
        return chars.join("");
    }

    return (
        <pattern action={action}>
            <_ />
            <text>"</text>
            <SCharSequence label="chars" />
            <text>"</text>
            <_ />
        </pattern>
    )
}

/**
 * s-char-sequence:
        s-char
        s-char-sequence s-char
 */
export function SCharSequence() {
    return (
        <repeat type="*">
            <SChar />
        </repeat>
    )
}

/**
 * s-char:
        any member of the source character set except the double-quote ", backslash \, or new-line character
        escape-sequence
        universal-character-name
 */
export function SChar() {
    return (
        <or>
            <pattern action={({ char }) => char}>
                <assert type="without">
                    <set>"\\\n</set>
                </assert>
                <SourceCharacter label="char" />
            </pattern>
            <EscapeSequence />
        </or>
    )
}

/**
 * escape-sequence:
        simple-escape-sequence
        octal-escape-sequence
        hexadecimal-escape-sequence
 */
export function EscapeSequence() {
    return (
        <SimpleEscapeSequence />
    )
}

/**
 * simple-escape-sequence: one of
        \’ \" \? \\
        \a \b \f \n \r \t \v
 */
export function SimpleEscapeSequence() {
    const escape = [
        `\\\\\\\'`, // \\\\\\\' -> (as content of text) \\\' -> (as rule) '\\\'' -> (matched) '\''
        `\\\\"`, // \\\\" -> (as content of text) \\" -> (as rule) '\\"' -> (matched) '\"'
        `\\?`,
        `\\\\\\\\`,  // \\\\\\\\ -> (as content of text) \\\\ -> (as rule) '\\\\' -> (matched) '\\'
        `\\\\a`,
        `\\\\b`,
        `\\\\f`,
        `\\\\n`,
        `\\\\r`,
        `\\\\t`,
        `\\\\v`,
    ].map(each => (
        <text label="char">{each}</text>
    ))

    return (
        <or>
            {escape}
        </or>
    )
}