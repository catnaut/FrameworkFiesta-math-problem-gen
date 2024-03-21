import { useFileSystemAccess } from '@vueuse/core';

const DATATYPE = 'Text' ;

const res = {
    dataType: DATATYPE,
    types: [{
      description: 'text',
      accept: {
        'text/plain': ['.txt', '.html'],
      },
    }],
    excludeAcceptAllOption: true,
};

  /**
   * @class Files
   */
const Files = {
  /**
   * @class useFileSystemAccess
   * @see https://vueuse.org/useFileSystemAccess
   * @example answer.data
   */
    answer: useFileSystemAccess(res),
  /**
   * @class useFileSystemAccess
   * @see https://vueuse.org/useFileSystemAccess
   * @example problem.data
   */
    problem: useFileSystemAccess(res),
    save:() => {
        // TODO: async
        this.problem.save()
        this.answer.save()
    }
};

export default Files;



