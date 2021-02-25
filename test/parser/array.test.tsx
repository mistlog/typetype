import { ReactPeg } from "react-peg";
import { ArrayType, TypeExpression } from "../../src";
import { saveAST } from "../common";

describe("parser: array", () => {
    test("ArrayType", () => {
        const parser = ReactPeg.render(<ArrayType />);
        const ast = parser.parse(`string[]`);
        saveAST(ast, "ArrayType.json");
        expect(ast).toMatchSnapshot();
    })

    test("ArrayType: any", () => {
        const parser = ReactPeg.render(<ArrayType />);
        const ast = parser.parse(`any[]`);
        saveAST(ast, "ArrayType-Any.json");
        expect(ast).toMatchSnapshot();
    })

    test("ArrayType: deep", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`string[][]`);
        saveAST(ast, "ArrayType-Deep.json");
        expect(ast).toMatchSnapshot();
    })
})