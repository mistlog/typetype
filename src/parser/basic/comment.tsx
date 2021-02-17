import { ReactPeg } from "react-peg";
import { SourceCharacter } from "./string";

export interface IComment {
    comment: string
}

export function MultiLineComment() {
    return (
        <pattern action={({ comment }) => {
            return { comment }
        }}>
            <text>/*</text>
            <list label="comment">
                <pattern action={({ globalFunction }) => globalFunction.text()}>
                    <repeat type="*">
                        <assert type="without">
                            <text>*/</text>
                        </assert>
                        <SourceCharacter />
                    </repeat>
                </pattern>
            </list>
            <text>*/</text>
        </pattern>
    )
}