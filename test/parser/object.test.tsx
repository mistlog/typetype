import { ReactPeg } from "react-peg";
import { TypeObjectProperty, ObjectTypeLiteral } from "../../src";
import { saveAST } from "../common";

describe("parser: object", () => {

    test("ObjectType: call signature", () => {
        const parser = ReactPeg.render(<ObjectTypeLiteral />);
        const ast = parser.parse(`
            {
                new (someArg: number): boolean,
                (a: number, b: number): number
            }
        `);
        saveAST(ast, "ObjectType-CallSignature.json");
        expect(ast).toMatchSnapshot();
    
        //
        expect(parser.parse(`{}`)).toMatchSnapshot();
    })

    test("ObjectType: modifier", () => {
            const parser = ReactPeg.render(<ObjectTypeLiteral />);
            const ast = parser.parse(`
                {
                    readonly a ?: number
                }
            `);

            saveAST(ast, "ObjectType-Modifier.json");
            expect(ast).toMatchSnapshot();
    })

    test("ObjectType", () => {
        const parser = ReactPeg.render(<ObjectTypeLiteral />);
        const ast = parser.parse(`
            {
                a: number,
                b: string,
                c: 1,
                d: "abc"
            }
        `);
        saveAST(ast, "ObjectType.json");
        expect(ast).toMatchSnapshot();
    
        //
        expect(parser.parse(`{}`)).toMatchSnapshot();
    })

    test("ObjectType: whitespace in key", () => {
        const parser = ReactPeg.render(<ObjectTypeLiteral />);
        const ast = parser.parse(`
            {
                "temp value": number
            }
        `);
        saveAST(ast, "ObjectType-Key-WhiteSpace.json");
        expect(ast).toMatchSnapshot();
    })
    
    test("ObjectType: shorthand", () => {
        const parser = ReactPeg.render(<ObjectTypeLiteral />);
        const ast = parser.parse(`
            {
                hello
            }
        `);
        saveAST(ast, "ObjectType-Shorthand.json");
        expect(ast).toMatchSnapshot();
    })
    
    test("ObjectType: spread", () => {
        const parser = ReactPeg.render(<ObjectTypeLiteral />);
        const ast = parser.parse(`
            {
                hello,
                ...obj
            }
        `);
        saveAST(ast, "ObjectType-Spread.json");
        expect(ast).toMatchSnapshot();
    })

    test("TypeObjectProperty", () => {
        const parser = ReactPeg.render(<TypeObjectProperty />);
        expect(parser.parse(`a: number`)).toMatchSnapshot();
        expect(parser.parse(`b: string`)).toMatchSnapshot();
        expect(parser.parse(`c: 1`)).toMatchSnapshot();
        expect(parser.parse(`d: "abc"`)).toMatchSnapshot();
    })
})