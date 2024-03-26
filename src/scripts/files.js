import { useFileSystemAccess } from '@vueuse/core'
import Papa from 'papaparse'

const DATATYPE = 'Text'

const res = {
  dataType: DATATYPE,
  types: [
    {
      description: 'csv file',
      accept: {
        'text/csv': ['.csv']
      }
    }
  ],
  excludeAcceptAllOption: true
}

/**
 * @class Files
 */
const Files = {
  /**
   * @see https://vueuse.org/useFileSystemAccess
   * @example answer.data
   */
  answer: useFileSystemAccess(res),
  /**
   * @see https://vueuse.org/useFileSystemAccess
   * @example problem.data
   */
  problem: useFileSystemAccess(res),
  checkResult: useFileSystemAccess(res),
  save: () => {
    // TODO: async
    this.problem.save()
    this.answer.save()
    this.checkResult.save()
  },
  /**
   * 传入一个文件对象，解析文件内容，返回问题集合
   * @param {Ref} FileObject
   * @returns {Set} ProblemSet
   */
  csvToSet: async (FileObject) => {
    return new Promise((resolve, reject) => {
      try {
        console.log(FileObject)
        // result = await Papa.parse(FileObject.data.value, {
        Papa.parse(FileObject.data.value, {
          header: false,
          complete: e => {
            let data = e.data.slice(1) // 去掉表头
            data = data.filter((item) => item.length >= 2).map((item) => item.slice(0, 2)) // 去掉空行和多余的数据
            resolve(new Set(data)) // 返回问题集合
          }
        })
      } catch (error) {
        // TODO: Error handling
        console.error(error)
        reject(error)
      }
    })
  }
}

export default Files
