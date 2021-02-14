import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import generate from "@babel/generator";

const root = resolve(__dirname, "../assets");

//
const astRoot = resolve(root, "./ast");

export function loadAST(path: string) {
    return JSON.parse(readFileSync(resolve(astRoot, path), "utf8"));
}

export function saveAST(data: any, path: string) {
    writeFileSync(resolve(astRoot, path), JSON.stringify(data, null, 4), "utf8");
}

//
const tsTypeRoot = resolve(root, "./ts-type");

export function saveCode(code: string, path: string) {
    writeFileSync(resolve(tsTypeRoot, path), code, "utf8");
}

//
const typetypeRoot = resolve(root, "./typetype");

export function loadType(name: string) {
    return readFileSync(resolve(typetypeRoot, name), "utf8");
}

export function generateCode(ast: any) {
    const code = generate(ast).code;
    return code;
}