import * as dateUtils from "./date-utils";

const mockSingleDay = ["Monday"];
const mockMultipleDays = ["Monday", "Wednesday", "Friday"];

it("displays the correct letter when one day is passed in", () => {
  expect(dateUtils.displayLetterForDayOfWeek(mockSingleDay)).toBe("M");
});

it("displays the correct format with spacers for multiple days", () => {
  expect(dateUtils.displayLetterForDayOfWeek(mockMultipleDays)).toBe(
    "M | W | F"
  );
});
