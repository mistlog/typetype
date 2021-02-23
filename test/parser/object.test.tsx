import { ReactPeg } from "react-peg";
import { ObjectType } from "../../src";

describe("parser: object", () => {
    test("ObjectType: modifier", () => {
            const parser = ReactPeg.render(<ObjectType />);
            const ast = parser.parse(`
                {
                    readonly a ?: number
                }
            `);
            expect(ast).toMatchSnapshot();
    })
})