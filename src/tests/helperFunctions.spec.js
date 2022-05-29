/* eslint-disable no-undef */
import helperFunctions from '../utils/helperFunctions';

describe('Test helper functions', () => {
  test('Test if compare arrays functions returns an integer', () => {
    expect(typeof (helperFunctions.compareArrays([1, 2, 3, 4, 5], [2, 1, 3, 4, 6]))).toBe('number');
  });

  test('Test if compare arrays returns 0 if there are not similarities', () => {
    expect(helperFunctions.compareArrays([11, 7, 8, 9, 10], [2, 1, 3, 4, 6])).toEqual(0);
  });

  test('Test if compare arrays returns 0 if empty arrays are passed', () => {
    expect(helperFunctions.compareArrays([], [])).toEqual(0);
  });

  test('Test if compare arrays returns 1 if the same arrays are passed', () => {
    expect(helperFunctions.compareArrays([1, 2, 3, 5, 6], [1, 2, 3, 5, 6])).toEqual(1);
  });
});
