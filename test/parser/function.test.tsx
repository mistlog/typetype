import { ReactPeg } from "react-peg";
import { TypeExpression } from "../../src";
import { saveAST } from "../common";

describe("parser: function", () => {
    test("FunctionType", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`type () => void`);
        saveAST(ast, "FunctionType.json");
        expect(ast).toMatchSnapshot();
    })

    test("FunctionType: rest", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`type (...args: any[]) => void`);
        saveAST(ast, "FunctionType-Rest.json");
        expect(ast).toMatchSnapshot();
    })

    test("FunctionType: params", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`type (a:number, b: string) => number`);
        saveAST(ast, "FunctionType-Params.json");
        expect(ast).toMatchSnapshot();
    })

    test("FunctionType: nested", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`type () => type (a: number, b: string) => void`);
        saveAST(ast, "FunctionType-Nested.json");
        expect(ast).toMatchSnapshot();
    })

    test("FunctionType: type param", () => {
        const parser = ReactPeg.render(<TypeExpression />);
        const ast = parser.parse(`type <K extends string, T>(key: K, value: T) => void`);
        saveAST(ast, "FunctionType-TypeParam.json");
        expect(ast).toMatchSnapshot();
    })
})