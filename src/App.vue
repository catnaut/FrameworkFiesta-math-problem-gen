<script setup>
import MainNav from './components/MainView/MainNav.vue';
import MainTable from './components/MainView/MainTable.vue';
import Files from '@/scripts/files'
import { Button } from '@/components/ui/button'
import { ref } from 'vue';

/**
 * 问题集合
 * @type {Ref<Set>}
 */
let problemSet = ref()

/**
 * 答案集合
 * @type {Ref<Set>}
 */
let answerSet = ref()

// 从子组件接收的问题
let problemReceived = ''

async function handleImportProblem() {
  await Files.problem.open()
  problemSet.value = await Files.csvToSet(Files.problem)
  console.log('Problem Set\n', problemSet.value)
}

async function handleExportProblem() {
  Files.problem.data.value = problemReceived
  await Files.problem.saveAs()
}

async function handleImportAnswer() {
  await Files.answer.open()
  answerSet.value = await Files.csvToSet(Files.answer)
  console.log('Answer Set\n', answerSet.value)
}

async function handleExportAnswer() {
  Files.answer.data.value = 'test content'
  await Files.answer.save()
}

// 接受子组件传来的问题
function receiveProblem(problem) {
  // 将问题数组按规定格式转换成字符串
  problem.forEach((item, index) => {
    problemReceived += `${index + 1}. ${item}\n`
  })
}
</script>

<template>
  <MainNav @getProblem="receiveProblem" :importedProblem="problemContent" />
  <MainTable />
  <div class="flex mx-auto w-4/5  items-center space-x-4 justify-center">
    <Button class="" @click="handleImportProblem">Import Problem</Button>
    <Button class="" @click="handleExportProblem">Export Problem</Button>
    <Button class="" @click="handleImportAnswer">Import Answer</Button>
    <Button class="" @click="handleExportAnswer">Export Answer</Button>
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
