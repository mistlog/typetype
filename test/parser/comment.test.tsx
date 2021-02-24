import { ReactPeg } from "react-peg";
import { MultiLineComment, _ } from "../../src";

describe("parser: comment", () => {
    test("MultiLineComment", () => {
        const parser = ReactPeg.render(<MultiLineComment />);
        expect(parser.parse("/* this is comment */")).toMatchSnapshot();
    })

    test("MultiLineComment: 2", () => {
        const parser = ReactPeg.render(<_ />);
        expect(parser.parse(`
            /* 
                this is comment 
            */
        `)).toMatchSnapshot();
    })
    
    test("MultiLineComment: 3", () => {
        const parser = ReactPeg.render(<_ />);
        expect(parser.parse(`
            /**
             * this is comment
             */
        `)).toMatchSnapshot();
    })

    test("MultiLineComment: 4", () => {
        const parser = ReactPeg.render(<_ />);
        expect(parser.parse(`
            /**
             * test it in typescript playgorund:
             * 
             * type url = \`http://admin:123456@github.com:8080\`;
             * type result = parseURL<url>
             */
        `)).toMatchSnapshot();
        
    })
})