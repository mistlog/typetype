import { ReactPeg } from "react-peg";
import { _ } from "../common";

export function SourceCharacter() {
    return (
        <any/>
    )
}

/**
 * string-literal:
       encoding-prefixopt" s-char-sequenceopt"
       encoding-prefixoptR raw-string
 */
export function String() {
    const action = ({ globalFunction }) => {
        const trimmed = globalFunction.text().trim();
        const value = trimmed.slice(1, trimmed.length - 1);
        return value;
    }

    return (
        <pattern action={action}>
            <_ /><text>"</text><_ />
            <SCharSequence />
            <_ /><text>"</text><_ />
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