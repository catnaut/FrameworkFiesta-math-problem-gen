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

/**
 * 优先级
 * @type {Object}
 */
const priority = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2
}

/**
 * AST 节点
 * @property {Node} left - 左节点
 * @property {Node} right - 右节点
 * @property {String} originValue - 原始值
 * @property {Boolean} isOperator - 是否是操作符
 * @property {Number} value - 节点所代表树的值
 */
export class Node {
  /**
   * @param {String} value
   */
  constructor(value) {
    this._value = undefined
    this.left = null
    this.right = null

    /**
     * @private 缓存列表
     * @type {String[]}
     */
    this._list = undefined // 缓存列表
    this.originValue = value // 原始值
    value in priority ? (this.isOperator = true) : (this.isOperator = false) // 是否是操作符
  }

  /**
   * 是否是叶子节点
   * @returns {Boolean}
   */
  get isLeaf() {
    return !this.left && !this.right
  }

  /**
   * 是否是满节点
   * @returns {Boolean}
   */
  get isFull() {
    return !!(this.left && this.right)
  }

  /**
   * 添加节点
   * @param {Node} node
   */
  add(node) {
    if (!this.left) {
      this.left = node
    } else if (!this.right) {
      // 有左节点 没有右节点 需要比较大小
      if (node > this.left) {
        // 如果右节点大于左节点 交换位置
        this.right = this.left
        this.left = node
      } else {
        this.right = node
      }
    } else {
      throw new Error('Node is full')
    }
  }

  /**
   * 获取节点的值
   * @returns {Number}
   */
  get value() {
    if (this._value) return this._value // 有缓存值 直接返回

    // 没有缓存值
    if (this.isLeaf) {
      // 叶子节点 直接从列表中取值转为数字
      this._value = strToNumber(this.originValue)
    } else {
      // 非叶子节点 递归计算
      const left = this.left.value
      const right = this.right.value
      if (this.isOperator) {
        switch (this.originValue) {
          case '+':
            this._value = left + right
            break
          case '-':
            this._value = left - right
            break
          case '*':
            this._value = left * right
            break
          case '/':
            this._value = left / right
            break
          default:
            throw new Error('unknown Error') // 我们不应该走到这里
        }
      } else {
        throw new Error('invalid node') // 非操作符节点
      }
    }
    return this._value
  }
  /**
   * 重写 valueOf 方法，实现比较
   * @override
   * @returns {Number}
   */
  valueOf() {
    return this.value
  }

  /**
   * 转化为列表
   * @returns {String[]}
   */
  toList() {
    if (this._list) return this._list // 有缓存值 直接返回

    this._list = [this.originValue] // 初始化列表
    if (this.isLeaf) {
      // 叶子节点 直接返回
      return this._list
    }
    // 非叶子节点 递归计算
    if (this.left) this._list = [...this.left.toList(), ...this._list]
    if (this.right) this._list = [...this._list, ...this.right.toList()]

    return this._list
  }

  toString() {
    return this.toList().join(' ')
  }
}
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
    /**
     * @readonly
     */
    this.operatorArr = operatorArr

    /**
     * @readonly
     */
    this.numArr = numArr
    this.expression = this.getExpression()
    this.answer = this.CalculateAnswer()
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

  /**
   * 计算答案
   * @returns {Number} answer
   */
  CalculateAnswer() {
    let operatorArr = [...this.operatorArr]
    let numArr = [...this.numArr].map((num) => strToNumber(num))
    for (let i = 0; i < operatorArr.length; i++) {
      if (operatorArr[i] === '/' || operatorArr[i] === '*') {
        let left = numArr[i]
        let right = numArr[i + 1]
        let result = operatorArr[i] === '*' ? left * right : left / right
        numArr.splice(i, 2, result)
        operatorArr.splice(i, 1)
        // 重新检查当前位置的操作符
        i--
      }
    }
    for (let i = 0; i < operatorArr.length; i++) {
      if (operatorArr[i] === '+' || operatorArr[i] === '-') {
        let left = numArr[i]
        let right = numArr[i + 1]
        let result = operatorArr[i] === '+' ? left + right : left - right
        numArr.splice(i, 2, result)
        operatorArr.splice(i, 1)
        // 重新检查当前位置的操作符
        i--
      }
    }
    return numArr[0]
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
    this.settings = { ...settings }
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

  strToOperator(str) {
    switch (str) {
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
   * @description 生成操作符列表
   * @param {number} length - 操作符数量
   * @returns {String[]} An array of operators.
   * @throws {Error} 没有操作符或者无法识别的操作符
   */
  randomOperatorList(length) {
    let operatorList = []

    if (this.operators.length === 0 || length > this.operators.length) {
      throw new Error('Invalid operator length')
    }

    let operators = [...this.operators]
    for (let i = 0; i < length; i++) {
      let index = randomInt(operators.length)
      operatorList.push(operators.splice(index, 1)[0])
    }
    return operatorList.map((operator) => this.strToOperator(operator))
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
    return this.settings.range > 0 && this.settings.quantity > 0 && this.operators.length > 0
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

    // 生成生成问题操作数数量
    let amountOfOperators
    this.operators.length > 3
      ? (amountOfOperators = 3)
      : (amountOfOperators = this.operators.length)

    for (let i = 0; i < this.settings.quantity; i++) {
      // TODO: 生成问题数字个数
      this.problemsList.push(this.generateProblem(amountOfOperators, 5))
    }
  }

  // TOTEST: 生成一道题目
  /**
   * @description 生成一道题目
   * @param {number} amountOfOperators 一道题中的操作数个数
   * @param {number} amountOfNumbers 一道题中的数字个数
   */
  generateProblem(amountOfOperators, amountOfNumbers) {
    const probability = this.settings.probability
    let numArr = []
    let operatorArr = []
    const range = this.settings.range

    if (amountOfOperators > 3) {
      throw new Error('Invalid amount of operators')
    }

    // 生成操作数
    for (let i = 0; i < amountOfNumbers; i++) {
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
    const operatorList = this.randomOperatorList(amountOfOperators)
    for (let i = 0; i < amountOfNumbers - 1; i++) {
      let index = randomInt(operatorList.length)
      operatorArr.push(operatorList[index])
    }

    return new Problem(operatorArr, numArr)
  }
}
