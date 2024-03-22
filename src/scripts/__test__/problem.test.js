import { expect, test } from 'vitest'

import { randomInt, Problem } from '../problem'
test('randomInt', () => {
  expect(randomInt(10)).toBeGreaterThanOrEqual(0)
  expect(randomInt(10)).toBeLessThanOrEqual(10)
})
test('Problem constructor should set operatorArr and numArr correctly', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = [1, 2, 3, 4, 5]
  const problem = new Problem(operatorArr, numArr)
  expect(problem.operatorArr).toEqual(operatorArr)
  expect(problem.numArr).toEqual(numArr)
})

test('Problem constructor should throw an error when operatorArr and numArr lengths do not match', () => {
  const operatorArr = ['+', '-']
  const numArr = [1, 2]
  expect(() => new Problem(operatorArr, numArr)).toThrowError(Error('Invalid problem'))
})

test('Problem constructor should throw an error when operatorArr and numArr lengths do not match', () => {
  const operatorArr = ['+']
  const numArr = [1, 2, 3]
  expect(() => new Problem(operatorArr, numArr)).toThrowError(Error('Invalid problem'))
})

test('Problem getExpression should return a valid expression', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = [1, 2, 3, 4, 5]
  const problem = new Problem(operatorArr, numArr)
  const expression = problem.getExpression()
  expect(expression).toBe('1 + 2 - 3 * 4 / 5')
})

test('Problem operatorTypesCount should return a valid count of operator types', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = [1, 2, 3, 4, 5]
  const problem = new Problem(operatorArr, numArr)
  const count = problem.operatorTypesCount
  expect(count).toBe(4)
})
