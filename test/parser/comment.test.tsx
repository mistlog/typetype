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
})