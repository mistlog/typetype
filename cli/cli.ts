import { default as traverse } from "filewalker";
import { default as watch } from "node-watch";
import { readFileSync } from "fs";
import { transform } from "../src"
import { outputFileSync, removeSync } from "fs-extra";

function TraverseDirectory(path: string, callback: (relative: string, absolute: string) => void) {
    const action = (relative: string, stats, absolute: string) => callback(relative, absolute);
    traverse(path)
        .on("file", action)
        .on("error", error => console.log(error))
        .walk();
}

function transformFile(absolute: string, config = { debug: false }) {
    const input = readFileSync(absolute, "utf8");
    const output = transform(input, config).code;
    outputFileSync(absolute.replace(".type", ".ts"), output, "utf8");
}

export function build(dir: string, options: { watch: boolean }) {
    if (options.watch) {
        watch(dir, { recursive: true }, (event, absolute: string) => {
            if (absolute.endsWith(".type")) {
                console.log(event, absolute);
                debug(absolute);
            }
        });
    } else {
        TraverseDirectory(dir, (relative, absolute) => {
            if (absolute.endsWith(".type")) {
                transformFile(absolute);
            }
        })
    }
}

export function clean(dir: string) {
    TraverseDirectory(dir, (relative, absolute) => {
        if (absolute.endsWith(".type")) {
            removeSync(absolute.replace(".type", ".ts"));
        }
    })
}

export function debug(absolute: string) {
    try {
        transformFile(absolute, { debug: true });
    } catch (error) {
        console.log(`build type failed: ${absolute}`);
        console.log(error.message);
        console.log(error.backtrace);
    }
}