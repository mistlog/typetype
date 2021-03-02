import { ReactPeg } from "react-peg";
import { loadType, saveAST } from "../common";
import { StringTypeLiteral } from "../../src";

describe("parser: string", ()=>{
    test("String: special char", () => {
        const parser = ReactPeg.render(<StringTypeLiteral />);
        const name = "String-SpecialChar";
        const code = loadType(name);

        const ast = parser.parse(code);
        saveAST(ast, `${name}.json`);
        expect(ast).toMatchSnapshot();
    })
})