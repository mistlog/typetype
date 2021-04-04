#!/usr/bin/env node
import { default as program } from "commander";
import { readJSONSync, lstatSync } from "fs-extra";
import { resolve } from "path";
import { build, clean, debug } from "./cli";

const packageJSON = readJSONSync(resolve(__dirname, "../../package.json"));
program.version(packageJSON.version);

program
    .option('-w, --watch', "watch mode")

program
    .command("build <dir>")
    .description("build ts type")
    .action((dir: string) => {
        const path = resolve(process.cwd(), dir);
        if (lstatSync(path).isDirectory()) {
            const options = program.opts();
            build(path, { watch: options.watch });
        }
    });

program
    .command("clean <dir>")
    .description("clean ts type")
    .action((dir: string) => {
        const path = resolve(process.cwd(), dir);
        if (lstatSync(path).isDirectory()) {
            clean(path);
        }
    });

program
    .command("debug <file>")
    .description("debug ts type")
    .action((file: string) => {
        const path = resolve(process.cwd(), file);
        if (!lstatSync(path).isDirectory()) {
            debug(path);
        }
    });

program.parse(process.argv);
