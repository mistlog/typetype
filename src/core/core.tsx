import { ReactPeg } from "react-peg";
import { TypeFile } from "../parser";
import { TSFile } from "../generator";
import generate from "@babel/generator";

export interface ITypeTypeConfig {

}

export interface ITypeTypeResult {
    code: string
}

export function transform(source: string, config: ITypeTypeConfig = {}): ITypeTypeResult {
    const parser = ReactPeg.render(<TypeFile />);
    const ast = parser.parse(source);
    const tsFile = TSFile(ast);
    const code = generate(tsFile).code;

    const result: ITypeTypeResult = {
        code
    }

    return result;
}