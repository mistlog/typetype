import { transform } from "../src";

test("transform", () => {
    const result = transform(`
        type temp = string
        type function func = (T) => {a: T}
    `);
    expect(result).toMatchSnapshot();
})