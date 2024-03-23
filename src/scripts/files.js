import { useFileSystemAccess } from '@vueuse/core'
import Papa from 'papaparse'

const DATATYPE = 'Blob'

const res = {
  dataType: DATATYPE,
  types: [
    {
      description: 'csv file',
      accept: {
        // 'text/plain': []
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
  save: () => {
    // TODO: async
    this.problem.save()
    this.answer.save()
  },
  parse: async () => {
    Papa.parse(Files.problem.data.value, {
      header: false,
      complete: (results) => {
        console.log('Complete', results)
      }
    })
    // console.log(result.data)
  }
}

export default Files
