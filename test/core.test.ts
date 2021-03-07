import { transform } from "../src";

test("transform", () => {
    const result = transform(`
        type temp = string
        type function func = (T) => {a: T}
    `);
    expect(result).toMatchSnapshot();
})

test("transform: backtrace", () => {
    try {
        transform(`
            type temp = string
            type function func = (T) = {a: T}
        `);
    } catch (error) {
        expect(JSON.stringify(error, null, 4)).toMatchSnapshot();
    }

    try {
        transform(`
            type temp = string
            type function func = (T) = {a: T}
        `, { debug: true });
    } catch (error) {
        expect(JSON.stringify(error, null, 4)).toMatchSnapshot();
    }
})