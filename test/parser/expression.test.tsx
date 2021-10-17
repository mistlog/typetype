import { ReactPeg } from "react-peg";
import { UnionType, IntersectionType, ContextType } from "../../src";
import { loadType, saveAST } from "../common";

describe("parser: expression", () => {
    test("UnionType", () => {
        const parser = ReactPeg.render(<UnionType />);
        const ast = parser.parse(`union ["0", "1"]`);
        saveAST(ast, "UnionType.json");
        expect(ast).toMatchSnapshot();

        {
            const ast = parser.parse(`| ["0", "1"]`);
            expect(ast).toMatchSnapshot();
        }
    })

    test("UnionType: special char", () => {
        const parser = ReactPeg.render(<UnionType />);
        const name = "UnionType-SpecialChar";
        const code = loadType(name);

        const ast = parser.parse(code);
        saveAST(ast, `${name}.json`);
        expect(ast).toMatchSnapshot();
    })

    test("IntersectionType", () => {
        const parser = ReactPeg.render(<IntersectionType />);
        const ast = parser.parse(`combine ["0", "1"]`);
        saveAST(ast, "IntersectionType.json");
        expect(ast).toMatchSnapshot();

        {
            const ast = parser.parse(`& ["0", "1"]`);
            expect(ast).toMatchSnapshot();
        }
    })

    test("ContextType", () => {
        const parser = ReactPeg.render(<ContextType />);
        const type = loadType("ContextType")
        const ast = parser.parse(type);
        saveAST(ast, "ContextType.json");
        expect(ast).toMatchSnapshot();
    })
})