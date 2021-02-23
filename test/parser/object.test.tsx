import { ReactPeg } from "react-peg";
import { ObjectType } from "../../src";
import { saveAST } from "../common";

describe("parser: object", () => {
    test("ObjectType: modifier", () => {
            const parser = ReactPeg.render(<ObjectType />);
            const ast = parser.parse(`
                {
                    readonly a ?: number
                }
            `);

            saveAST(ast, "ObjectType-Modifier.json");
            expect(ast).toMatchSnapshot();
    })
})