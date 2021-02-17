import { ReactPeg } from "react-peg";
import { loadType, saveAST } from "../common";
import { TypeFunctionDeclaration } from "../../src";

describe("parser: examples", () => {
    function toAST(name: string) {
        const parser = ReactPeg.render(<TypeFunctionDeclaration />);
        const code = loadType(name);
        const ast = parser.parse(code);
        saveAST(ast, `${name}.json`);
        return ast;
    }

    test("comment", () => {
        const name = "Example-comment";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("pick", () => {
        const name = "Example-pick";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseURL", () => {
        const name = "Example-parseURL";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseURL: 2", () => {
        const name = "Example-parseURL-2";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseProtocol", () => {
        const name = "Example-parseProtocol";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseUserInfo", () => {
        const name = "Example-parseUserInfo";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseAuthority", () => {
        const name = "Example-parseAuthority";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("_isNumberString", () => {
        const name = "Example-_isNumberString";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parsePort", () => {
        const name = "Example-parsePort";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("isNumberString", () => {
        const name = "Example-isNumberString";
        expect(toAST(name)).toMatchSnapshot();
    })

    test("parseHost", () => {
        const name = "Example-parseHost";
        expect(toAST(name)).toMatchSnapshot();
    })
})