import * as phillipsHueUtils from "./phillips-hue-utils";

describe("generateGroupArray()", () => {
  it("generateGroupValues - should return an array of groupings", () => {
    const mockGroups = {
      "1": {
        action: {
          bri: 25,
          ct: 25
        }
      },
      "2": {
        action: {
          bri: 50,
          ct: 50
        }
      },
      "3": {
        action: {
          bri: 75,
          ct: 75
        }
      }
    };
    expect(phillipsHueUtils.generateGroupArray(mockGroups)).toEqual([
      { groupId: 1, currentCt: 25, currentBri: 25 },
      { groupId: 2, currentCt: 50, currentBri: 50 },
      { groupId: 3, currentCt: 75, currentBri: 75 }
    ]);
  });
});

describe("getLightGradient()", () => {
  it("should increment based on percentage away from time", () => {
    const mockTarget = 256;
    const mockTime = 30;
    const mockCurrent = 200;
    expect(
      phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
    ).toBe(228);
  });

  it("should decrement based on percentage away from time", () => {
    const mockTarget = 256;
    const mockTime = 45;
    const mockCurrent = 300;
    expect(
      phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
    ).toBe(289);
  });

  it("should return the target when time is 0", () => {
    const mockTarget = 256;
    const mockTime = 0;
    const mockCurrent = 300;
    expect(
      phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
    ).toBe(256);
  });

  it("should handle a 0 target", () => {
    const mockTarget = 0;
    const mockTime = 20;
    const mockCurrent = 200;
    expect(
      phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
    ).toBe(66);
  });

  it("should handle a 0 current", () => {
    const mockTarget = 200;
    const mockTime = 30;
    const mockCurrent = 0;
    expect(
      phillipsHueUtils.getLightGradient(mockTime, mockTarget, mockCurrent)
    ).toBe(100);
  });
});
