import { ReactPeg } from "react-peg";

// white space
export function _() {
    return (
        <repeat type="*">
            <set> \t\n\r</set>
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