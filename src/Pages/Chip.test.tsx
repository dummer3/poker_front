import React from "react";
import $ from "react-test";
import { BreakDownToChip } from "./Chip";

describe("Chip.js test", () => {
    it("BreakDown --- 0", () => {
        let counter = BreakDownToChip(0)
        expect(counter).toStrictEqual([]);
    });
});
