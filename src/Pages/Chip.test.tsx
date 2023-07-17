import React from "react";
import $ from "react-test";
import { BreakDownToChip } from "./Chip";

describe("Chip.js test", () => {
    it("BreakDown --- 0", () => {
        let counter = BreakDownToChip(0)
        expect(counter).toStrictEqual([]);
    });
    it("BreakDown --- 250", () => {
        let counter = BreakDownToChip(250)
        expect(counter).toStrictEqual([{ "color": "black", value: 2 }, { "color": "green", value: 2 }]);
    });
    it("BreakDown --- 749", () => {
        let counter = BreakDownToChip(749)
        expect(counter).toStrictEqual([{ "color": "black", value: 7 }, { "color": "green", value: 1 }, { "color": "blue", value: 2 }, { "color": "white", value: 4 }]);
    });
});
