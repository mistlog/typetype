import { ReactPeg } from "react-peg";
import { TupleType, OperatorType } from "../../src";
import { saveAST } from "../common";

describe("parser: tuple", () => {
    test("TupleType", () => {
        const parser = ReactPeg.render(<TupleType />);
        const ast = parser.parse(`[protocol, rest]`);
        saveAST(ast, "TupleType.json");
        expect(ast).toMatchSnapshot();
    })

    test("TupleType: rest", () => {
        const parser = ReactPeg.render(<TupleType />);
        const ast = parser.parse(`[protocol, ...rest]`);
        saveAST(ast, "TupleType-Rest.json");
        expect(ast).toMatchSnapshot();
    })

    test("TupleType: readonly", () => {
        const parser = ReactPeg.render(<OperatorType />);
        const ast = parser.parse(`readonly [string, number, object]`);
        saveAST(ast, "TupleType-Readonly.json");
        expect(ast).toMatchSnapshot();
    })

    test("TupleType: with infer", () => {
        const parser = ReactPeg.render(<TupleType />);
        const ast = parser.parse(`[infer protocol, infer rest]`);
        saveAST(ast, "TupleType-Infer.json");
        expect(ast).toMatchSnapshot();
    })
})
