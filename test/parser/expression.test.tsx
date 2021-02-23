import { ReactPeg } from "react-peg";
import { UnionType, IntersectionType } from "../../src";
import { saveAST } from "../common";

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
})