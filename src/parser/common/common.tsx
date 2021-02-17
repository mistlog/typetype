import { ReactPeg } from "react-peg";
import { MultiLineComment } from "../basic";

// white space
export function _() {
    return (
        <repeat type="*">
            <or>
                <MultiLineComment />
                <set> \t\n\r</set>
            </or>
        </repeat>
    );
}

export const Text = (content: string) => {
    return (
        <list>
            <_ /><text>{content}</text><_ />
        </list>
    )
}