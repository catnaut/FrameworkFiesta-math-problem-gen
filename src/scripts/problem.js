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
 *  @property {Object} probability - 生成概率
 *  @property {number} probability.integer - 整数
 *  @property {number} probability.fraction - 分数
 *  @property {number} probability.fraction.mixedFraction - 分数中带分数的概率
 */

/**
 * @typedef {Object} Problem
 * @property {Number} operatorTypesCount - 操作符种类数量
 * @property {String[]} operators - 操作符
 * @property {string[]} expression - 表达式
 * @property {Number} answer - 答案
 */

export class Problem {
  /**
   * @description 初始化问题
   * @param {String[]} operatorArr
   * @param {String[]} numArr
   * @throws {Error} 无效问题，操作符数量和操作数数量不匹配
   */
  constructor(operatorArr, numArr) {
    if (operatorArr.length !== numArr.length - 1) {
      throw new Error('Invalid problem')
    }
    this.operatorArr = operatorArr
    this.numArr = numArr
    this.expression = this.getExpression()
  }

  /**
   * 获取操作符的种类数量
   * @returns {Number} operatorTypesCount
   */
  get operatorTypesCount() {
    return new Set(this.operatorArr).size
  }

  /**
   * 返回问题表达式
   * @returns {String} expression
   */
  getExpression() {
    let expression = ''
    for (let i = 0; i < this.numArr.length; i++) {
      expression += this.numArr[i]
      if (i !== this.numArr.length - 1) expression += ` ${this.operatorArr[i]} `
    }
    return expression
  }

  // TODO: 重写toString方法
  // TOTEST: 生成问题的字符串表示
  /**
   * @description 生成问题的字符串表示，瞎写的不一定对
   * @returns {string} A string representation of the problem.
   */
  toString() {
    return `${this.expression} = ${this.answer}`
  }
}

export function randomInt(range) {
  return Math.floor(Math.random() * range)
}

// TODO: 讨论是否应该转为小数计算，会不会导致较为严重的误差
/**
 * @description 将字符串转换为小数, 支持整数、真分数、带分数
 * @param {string}
 * @returns {number} A decimal number.
 */
export function strToNumber(str) {
  if (str.includes('/')) {
    if (str.includes("'")) {
      let [integer, numerator, denominator] = str.split(/['/]/)
      return Number(integer) + Number(numerator) / Number(denominator)
    } else {
      let [numerator, denominator] = str.split('/')
      return Number(numerator) / Number(denominator)
    }
  } else return Number(str)
}

export default class Generator {
  /**
   * @param {Settings} settings
   * @returns {Generator}
   */
  constructor(settings) {
    this.settings = settings
    this.problemsList = []
    this.operators = this._getOperators()
  }

  /**
   * @description 基于 settings 生成操作列表
   * @returns {string[]} An array of operators.
   */
  _getOperators() {
    return Object.keys(this.settings.operators).filter((key) => this.settings.operators[key])
  }

  /**
   * @description 生成操作符
   * @returns {string} An operator.
   * @throws {Error} 没有操作符或者无法识别的操作符
   */
  randomOperator() {
    const operator = this.operators[randomInt(this.operators.length)]
    switch (operator) {
      case 'add':
        return '+'
      case 'sub':
        return '-'
      case 'mul':
        return '*'
      case 'div':
        return '/'
      default:
        throw new TypeError('Invalid operator')
    }
  }

  /**
   * @description 生成整数
   * @returns {string} value - 数字
   */
  randomInteger(range) {
    return randomInt(range).toString()
  }

  /**
   * @description 生成真分数
   * @returns {string} A proper fraction.
   * @example
   * '1/2'
   */
  randomProperFraction(range) {
    let numerator, denominator
    do {
      // 分子 分母 确保不为0 [1, range)
      numerator = randomInt(range - 1) + 1
      denominator = randomInt(range - 1) + 1
    } while (numerator <= denominator)

    return `${numerator}/${denominator}`
  }

  /**
   * @description 生成带分数
   * @param {Number} range
   * @returns {string} A mixed fraction.
   * @example
   * '3\'1/2'
   */
  randomMixedFraction(range) {
    let numerator, denominator
    do {
      // 分子 分母 确保不为0 [1, range)
      numerator = randomInt(range - 1) + 1
      denominator = randomInt(range - 1) + 1
    } while (numerator <= denominator)

    // 生成带分数的整数部分 保证分数部分和整数部分不超过range 并且整数部分不为0
    let integer = randomInt(range - 2) + 1

    return `${integer}'${numerator}/${denominator}`
  }

  /**
   * @description 检查设置是否合法
   * @returns {boolean} 是否合法
   */
  _checkSettings() {
    return this.settings.range > 0 && this.settings.quantity > 0
  }

  /**
   * @description 开始生成问题
   */
  generate() {
    // TODO: 异步执行
    if (!this._checkSettings()) {
      console.log(this.settings)
      throw new Error('Invalid settings')
    }

    for (let i = 0; i < this.settings.quantity; i++) {
      this.problemsList.push(this.generateProblem(3, this.settings.range))
    }
  }

  // TOTEST: 生成一道题目
  /**
   * @description 生成一道题目
   * @param {number} amountOfOperators 一道题中的操作数个数
   * @param {number} range 最大数值范围
   */
  generateProblem(amountOfOperators, range) {
    const probability = this.settings.probability
    let numArr = []
    let operatorArr = []

    if (amountOfOperators > 3) {
      throw new Error('Invalid amount of operators')
    }
    // 生成操作数
    for (let i = 0; i < amountOfOperators; i++) {
      let num

      if (range > 1) {
        //  可以生成整数 真分数 带分数
        if (Math.random() < probability.integer) {
          // 随机数小于整数概率 生成整数
          num = this.randomInteger(range)
        } else {
          // 随机数小于真分数概率 生成真分数
          num =
            Math.random() < probability.fraction.mixedFraction
              ? this.randomMixedFraction(range)
              : this.randomProperFraction(range)
        }
      } else if (range === 1) {
        // 只能返回 整数 1 (无需生成）和 生成真分数
        num = Math.random() < probability.integer ? 1 : this.randomProperFraction(1)
      } else {
        throw new Error('Invalid range')
      }
      numArr.push(num)
    }

    // 生成操作符
    for (let i = 0; i < amountOfOperators - 1; i++) operatorArr.push(this.randomOperator())

    return new Problem(operatorArr, numArr)
  }
}