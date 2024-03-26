<script setup>
import MainNav from './components/MainView/MainNav.vue';
import Files from '@/scripts/files'
import { Button } from '@/components/ui/button'
import { ref } from 'vue';

/**
 * 问题答案集合
 * @type {Ref<Set>}
 */
let problemAndAnswerSet = ref()

/**
 * 问题集合
 * @type {Ref<Set>}
 */
let problemSet = ref(new Set())

/**
 * 答案集合
 * @type {Ref<Set>}
 */
let answerSet = ref(new Set())

/**
 * 正确题号与错误题号数组
 * @type {Ref<Array>}
 */
let correctNumber = ref([])
let wrongNumber = ref([])

// 从子组件接收的问题
let problemReceived = ''

// 接受子组件传来的问题
function receiveProblem(problem) {
  // 将问题数组按规定格式转换成字符串
  problem.forEach((item, index) => {
    problemReceived += `${index + 1}. ${item}\n`
  })
}

async function handleImportProblemAndAnswer() {
  await Files.problem.open()
  problemAndAnswerSet.value = Array.from(await Files.csvToSet(Files.problem))
  console.log('problemAndAnswerSet Set\n', problemAndAnswerSet.value)
  problemAndAnswerSet.value.forEach(item => {
    problemSet.value.add(item[0])
    answerSet.value.add(item[1])
  })
  console.log('problem', problemSet.value)
  console.log('answer', answerSet.value)
}

async function handleExportProblem() {
  Files.problem.data.value = problemReceived
  await Files.problem.saveAs()
}

async function handleExportAnswer() {
  Files.answer.data.value = 'test content'
  await Files.answer.save()
}

async function checkAnswer() {
  let writtenContent = `Correct: ${correctNumber.value.length} (...)\nWrong: ${wrongNumber.value.length} (...)
  `
  Files.checkResult.data.value = writtenContent
  await Files.checkResult.save()
}
</script>

<template>
  <div class="flex flex-col justify-center align-center h-screen">
    <MainNav @getProblem="receiveProblem" :importedProblem="problemContent" />
    <div class="flex mx-auto w-4/5  items-center space-x-4 justify-center">
      <Button @click="handleImportProblemAndAnswer">Import Problem and Answer</Button>
      <Button @click="checkAnswer">Check Answer</Button>
      <Button @click="handleExportProblem">Export Problem</Button>
      <Button @click="handleExportAnswer">Export Answer</Button>
    </div>
  </div>
</template>

<style scoped>
body {
  font-size: 16px;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
