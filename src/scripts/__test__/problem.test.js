import { expect, test } from 'vitest'

import { randomInt, strToNumber, Problem, Node } from '../problem'
import Generator from '../problem'

test('randomInt', () => {
  expect(randomInt(10)).toBeGreaterThanOrEqual(0)
  expect(randomInt(10)).toBeLessThanOrEqual(10)
})

/**
 * @typedef {Object} Settings
 *  @property {number} quantity - 数量
 *  @property {number} range - 范围
 *  @property {Object} operators - 运算符
 *  @property {boolean} operators.add - 加法
 *  @property {boolean} operators.sub - 减法
 *  @property {boolean} operators.mul - 乘法
 *  @property {boolean} operators.div - 除法
 *  @property {boolean} autoCheck - 自动检查
 *  @property {boolean} showAnswer - 显示答案
 */

const SETTINGS = {
  quantity: 10,
  range: 10,
  operators: {
    add: true,
    sub: true,
    mul: true,
    div: true
  },
  autoCheck: true,
  showAnswer: true,
  probability: {
    integer: 0.5,
    fraction: {
      mixedFraction: 0.5
    }
  }
}

test('Generator constructor should return a instance of Generator', () => {
  const generator = new Generator(SETTINGS)
  expect(generator).toBeInstanceOf(Generator)
})

test('Generator constructor should return a valid instance', () => {
  const generator = new Generator(SETTINGS)
  expect(generator).toBeInstanceOf(Generator)
  expect(generator.settings).toEqual(SETTINGS)
  expect(generator.problemsList).toEqual([])
  expect(generator.operators).toEqual(['add', 'sub', 'mul', 'div'])
  expect(generator.operators.length).toBe(4)
})

test('Generator _getOperators should return a valid list of operators', () => {
  const generator = new Generator(SETTINGS)
  const operators = generator._getOperators()
  expect(operators).toEqual(['add', 'sub', 'mul', 'div'])
  expect(operators.length).toBe(4)
})

test('strToOperator should return the correct operator', () => {
  const generator = new Generator(SETTINGS)
  expect(generator.strToOperator('add')).toBe('+')
  expect(generator.strToOperator('sub')).toBe('-')
  expect(generator.strToOperator('mul')).toBe('*')
  expect(generator.strToOperator('div')).toBe('/')
})

test('strToOperator should throw an error for invalid operator', () => {
  const generator = new Generator(SETTINGS)
  expect(() => generator.strToOperator('%')).toThrowError(TypeError('Invalid operator'))
})

test('Generator randomInteger should return a valid random integer', () => {
  const generator = new Generator(SETTINGS)
  const random = generator.randomInteger(10)
  // is string
  expect(random).toBeTypeOf('string')
  // to number is in the range
  const num = parseInt(random)
  expect(num).toBeGreaterThanOrEqual(0)
  expect(num).toBeLessThan(10)
})

test('Generator randomProperFraction should return a valid fraction', () => {
  const generator = new Generator(SETTINGS)
  const fraction = generator.randomProperFraction(10)
  const [numerator, denominator] = fraction.split('/')
  const num = parseInt(numerator)
  const den = parseInt(denominator)

  expect(fraction).toMatch(/^\d+\/\d+$/)
  expect(num).toBeGreaterThanOrEqual(1)
  expect(num).toBeLessThan(10)
  expect(den).toBeGreaterThanOrEqual(1)
  expect(den).toBeLessThan(10)
  expect(num).toBeGreaterThan(den)
})

test('Generator randomMixedFraction should return a valid mixed fraction', () => {
  const generator = new Generator(SETTINGS)
  const fraction = generator.randomMixedFraction(10)
  const [integer, fractionPart] = fraction.split("'")
  const [numerator, denominator] = fractionPart.split('/')
  const int = parseInt(integer)
  const num = parseInt(numerator)
  const den = parseInt(denominator)

  expect(fraction).toMatch(/^\d+'(\d+\/\d+)$/)
  expect(int).toBeGreaterThanOrEqual(1)
  expect(int).toBeLessThan(9)
  expect(num).toBeGreaterThanOrEqual(1)
  expect(num).toBeLessThan(10)
  expect(den).toBeGreaterThanOrEqual(1)
  expect(den).toBeLessThan(10)
  expect(num).toBeGreaterThan(den)
})

test('strToNumber should convert integer to number', () => {
  const integer = '1'
  const result = strToNumber(integer)
  expect(result).toBe(1)
})

test('strToNumber should convert fraction with whole number to decimal', () => {
  const fraction = "3'1/2"
  const result = strToNumber(fraction)
  expect(result).toBe(3.5)
})

test('Generator fractionToNumber should convert fraction without whole number to decimal', () => {
  const fraction = '1/2'
  const result = strToNumber(fraction)
  expect(result).toBe(0.5)
})

test('Generator _checkSettings should return true when range and quantity are greater than 0', () => {
  const generator = new Generator(SETTINGS)
  const result = generator._checkSettings()
  expect(result).toBe(true)
})

test('Generator _checkSettings should return false when range is less than or equal to 0', () => {
  const generator = new Generator(SETTINGS)
  generator.settings.range = 0
  const result = generator._checkSettings()
  expect(result).toBe(false)
})

test('Generator _checkSettings should return false when quantity is less than or equal to 0', () => {
  const generator = new Generator(SETTINGS)
  generator.settings.quantity = 0
  const result = generator._checkSettings()
  expect(result).toBe(false)
})

test('Problem constructor should set operatorArr and numArr correctly', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = ['1', '2', '3', '4', '5']
  const problem = new Problem(operatorArr, numArr)
  expect(problem._operatorArr).toEqual(operatorArr)
  expect(problem._numArr).toEqual(numArr)
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
  const numArr = ['1', '2', '3', '4', '5']
  const problem = new Problem(operatorArr, numArr)
  const expression = problem.getExpression()
  expect(expression).toBe('1 + 2 - 3 * 4 / 5')
})

test('Problem operatorTypesCount should return a valid count of operator types', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = ['1', '2', '3', '4', '5']
  const problem = new Problem(operatorArr, numArr)
  const count = problem.operatorTypesCount
  expect(count).toBe(4)
})

test('Generator generateProblem should return a valid Problem instance', () => {
  const generator = new Generator(SETTINGS)
  const amountOfOperators = 3
  const range = 10
  const problem = generator.generateProblem(amountOfOperators, range)
  expect(problem).toBeInstanceOf(Problem)
})

test('Generator generateProblem should return a Problem instance with correct amount of operator', () => {
  const generator = new Generator(SETTINGS)
  const amountOfOperators = 3
  const range = 10
  const problem = generator.generateProblem(amountOfOperators, range)
  // 统计出现了多少种运算符
  const uniqueOperators = [...new Set(problem.operatorArr)]
  const operatorCount = uniqueOperators.length
  expect(operatorCount).toBeLessThanOrEqual(3)
})

test('Generator generateProblem should throw an error when amount of operator is invalid', () => {
  const generator = new Generator(SETTINGS)
  const amountOfOperators = 4
  const range = 10
  expect(() => generator.generateProblem(amountOfOperators, range)).toThrowError(
    Error('Invalid amount of operators')
  )
})

test('Generator generate should generate problems with valid settings', () => {
  const generator = new Generator(SETTINGS)
  generator.generate()
  expect(generator.problemsList.length).toBe(SETTINGS.quantity)
  generator.problemsList.forEach((problem) => {
    expect(problem).toBeInstanceOf(Problem)
  })
})

test('Generator generate should throw an error when settings are invalid', () => {
  const generator = new Generator(SETTINGS)
  generator.settings.quantity = 0
  expect(() => generator.generate()).toThrowError(Error('Invalid settings'))
})

test('Problem CalculateAnswer should return the correct result', () => {
  const operatorArr = ['+', '-', '*', '/']
  const numArr = ['1', '2', '3', '4', '5']
  const problem = new Problem(operatorArr, numArr)
  const result = problem.answer
  expect(result).toBe(0.6)
})

test('Node constructor should create a new instance of Node', () => {
  const node = new Node('+')
  expect(node).toBeInstanceOf(Node)
})

test('Node constructor should set the value and isOperator properties correctly', () => {
  const node = new Node('+')
  expect(node._value).toBeUndefined()
  expect(node.left).toBeNull()
  expect(node.right).toBeNull()
  expect(node.isOperator).toBe(true)
})

test('Node constructor should set the value and isOperator properties correctly', () => {
  const node = new Node('1')
  expect(node._value).toBeUndefined()
  expect(node.left).toBeNull()
  expect(node.right).toBeNull()
  expect(node.isOperator).toBe(false)
})

test('Node isLeaf getter should return true for leaf nodes', () => {
  const node = new Node('1')
  expect(node.isLeaf).toBe(true)
})

test('Node isLeaf getter should return false for non-leaf nodes', () => {
  const node = new Node('+')
  node.left = new Node('1')
  node.right = new Node('2')
  expect(node.isLeaf).toBe(false)
})

test('Node isFull getter should return true for nodes with both left and right children', () => {
  const node = new Node('+')
  node.left = new Node('1')
  node.right = new Node('2')
  expect(node.isFull).toBe(true)
})

test('Node isFull getter should return false for nodes without both left and right children', () => {
  const node = new Node('+')
  node.left = new Node('1')
  expect(node.isFull).toBe(false)
})

test('Node add method should add a node as the left child if left is null', () => {
  const node = new Node('+')
  const leftNode = new Node('1')
  node.add(leftNode)
  expect(node.left).toBe(leftNode)
})

test('Node add method should change when right bigger than left', () => {
  const node = new Node('+')
  const leftNode = new Node('1')
  const rightNode = new Node('2')
  node.add(leftNode)
  node.add(rightNode)
  expect(node.left).toBe(rightNode)
})

test('Node add method should add a node as the right child if left is not null and right is null', () => {
  const node = new Node('+')
  const leftNode = new Node('2')
  const rightNode = new Node('1')
  node.add(leftNode)
  node.add(rightNode)
  expect(node.left).toBe(leftNode)
  expect(node.right).toBe(rightNode)
})

test('Node add method should throw an error if both left and right are not null', () => {
  const node = new Node('+')
  const leftNode = new Node('1')
  const rightNode = new Node('2')
  node.add(leftNode)
  node.add(rightNode)
  const newNode = new Node('3')
  expect(() => node.add(newNode)).toThrowError(Error('Node is full'))
})

test('Node value getter should return the cached value if it exists', () => {
  const node = new Node('1')
  node._value = 1
  expect(node.value).toBe(1)
})

test('Node value getter should return the value of a leaf node', () => {
  const node = new Node('1')
  node._list = ['1']
  expect(node.value).toBe(1)
})

test('Node value getter should calculate the value of a non-leaf node', () => {
  const node = new Node('+')
  node.add(new Node('1'))
  node.add(new Node('2'))
  expect(node.value).toBe(3)
})

test('Node value getter should throw an error for an invalid node', () => {
  const node = new Node('invalid')
  node.left = new Node('1')
  node.right = new Node('2')
  expect(() => node.value).toThrowError(Error('invalid node'))
})

test('Node value getter should throw an error for an unknown Error', () => {
  const node = new Node('1')
  node._list = ['1']
  node.left = new Node('1')
  node.right = new Node('2')
  node.isOperator = true
  expect(() => node.value).toThrowError(Error('unknown Error'))
})

test('Node valueOf method should return the value of the node', () => {
  const node = new Node('1')
  node._value = 1
  expect(node.valueOf()).toBe(1)
})

test('Node toList method should convert the node and its children to a list', () => {
  const node = new Node('+')
  node.left = new Node('1')
  node.right = new Node('2')
  expect(node.toList()).toEqual(['1', '+', '2'])
})

test('Generator randomOperatorList should return a valid list of random operators', () => {
  const generator = new Generator(SETTINGS)
  generator.operators = ['add', 'sub', 'mul', 'div']
  const operatorList = generator.randomOperatorList(3)
  expect(operatorList).toHaveLength(3)
  operatorList.forEach((operator) => {
    expect(['+', '-', '*', '/']).toContain(operator)
  })
})

test('Generator randomOperatorList should throw an error for invalid operator length', () => {
  const generator = new Generator(SETTINGS)
  generator.operators = ['add', 'sub', 'mul', 'div']
  expect(() => generator.randomOperatorList(5)).toThrowError(Error('Invalid operator length'))
})
