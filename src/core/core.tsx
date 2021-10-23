import { ReactPeg } from "react-peg";
import { TypeFile } from "../parser";
import { TSFile } from "../generator";
import generate from "@babel/generator";
import { default as Tracer } from "pegjs-backtrace";
import { IRenderConfig } from "react-peg/build/renderer/renderer";

export interface ITypeTypeConfig {
    debug?: boolean
    context?: any
}

export interface ITypeTypeResult {
    code: string
}

export function transform(source: string, config: ITypeTypeConfig = { debug: false, context: {} }): ITypeTypeResult {
    const tracer = new Tracer(source, { useColor: false });
    const options: IRenderConfig = { tracer: config.debug ? tracer : null };
    const parser = ReactPeg.render(<TypeFile />, options);
    try {
        const ast = parser.parse(source, config.context);
        const tsFile = TSFile(ast);
        const code = generate(tsFile).code;

        const result: ITypeTypeResult = {
            code,
        }

        return result;
    } catch (error) {
        error['backtrace'] = tracer.getBacktraceString();
        throw error;
    }
}