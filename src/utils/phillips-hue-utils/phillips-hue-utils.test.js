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

it("getLightGradient - should increment properly", () => {
  const mockTarget = 256;
  const mockTime = 30;
  const mockCurrent = 200;
  expect(
    phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
  ).toBe(228);
});

it("getLightGradient - should decrement properly", () => {
  const mockTarget = 256;
  const mockTime = 45;
  const mockCurrent = 300;
  expect(
    phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
  ).toBe(289);
});

it("getLightGradient - should return the target when timeTo is 0", () => {
  const mockTarget = 256;
  const mockTime = 0;
  const mockCurrent = 300;
  expect(
    phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
  ).toBe(256);
});

it("getLightGradient - should handle a 0 target", () => {
  const mockTarget = 0;
  const mockTime = 20;
  const mockCurrent = 200;
  expect(
    phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
  ).toBe(66);
});

it("getLightGradient - should handle a 0 current", () => {
  const mockTarget = 200;
  const mockTime = 30;
  const mockCurrent = 0;
  expect(
    phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
  ).toBe(100);
});
