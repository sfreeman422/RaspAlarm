import * as phillipsHueUtils from "./phillips-hue-utils";

it("generateGroupValues - should return an array of numbers", () => {
  expect(
    phillipsHueUtils.generateGroupValues({
      "1": "dummyGroup 1",
      "2": "dummyGroup2",
      "3": "dummyGroup3"
    })
  ).toEqual([1, 2, 3]);
});

it("getLightGradient - should return 128 when a timeTo is 30 and visual is 256", () => {
  const mockCt = 256;
  const mockTime = 30;
  expect(phillipsHueUtils.getLightGradient(mockTime, mockCt)).toBe(128);
});

it("getLightGradient - should return the mockCt when timeTo is 0", () => {
  const mockCt = 256;
  const mockTime = 0;
  expect(phillipsHueUtils.getLightGradient(mockTime, mockCt)).toBe(256);
});
