import { transform } from "../src";

test("transform", () => {
    const result = transform(`
        import { Temp } from "./temp"
        type temp = string
        type function func = (T) => {a: T, b: Temp}
    `);
    expect(result.code).toMatchSnapshot();
})

test("transform: backtrace", () => {
    try {
        transform(`
            type temp = string
            type function func = (T) = {a: T}
        `);
    } catch (error) {
        delete error.stack;
        expect(JSON.stringify(error, null, 4)).toMatchSnapshot();
    }

    try {
        transform(`
            type temp = string
            type function func = (T) = {a: T}
        `, { debug: true });
    } catch (error) {
        delete error.stack;
        expect(JSON.stringify(error, null, 4)).toMatchSnapshot();
    }
})