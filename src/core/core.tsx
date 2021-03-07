import { ReactPeg } from "react-peg";
import { TypeFile } from "../parser";
import { TSFile } from "../generator";
import generate from "@babel/generator";
import * as Tracer from "pegjs-backtrace";
import { IRenderConfig } from "react-peg/build/renderer/renderer";

export interface ITypeTypeConfig {
    debug?: boolean
}

export interface ITypeTypeResult {
    code: string
}

export function transform(source: string, config: ITypeTypeConfig = { debug: false }): ITypeTypeResult {
    const tracer = new Tracer(source, { useColor: false });
    const options: IRenderConfig = { tracer: config.debug ? tracer : null };
    const parser = ReactPeg.render(<TypeFile />, options);
    try {
        const ast = parser.parse(source);
        const tsFile = TSFile(ast);
        const code = generate(tsFile).code;

        const result: ITypeTypeResult = {
            code,
        }

        return result;
    } catch (error) {
        const withBacktrace = new Error(error);
        withBacktrace['backtrace'] = tracer.getBacktraceString();
        throw withBacktrace;
    }
}