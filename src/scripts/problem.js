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
