<script setup>
import MainNav from './components/MainView/MainNav.vue';
import MainTable from './components/MainView/MainTable.vue';
import Files from '@/lib/files'
import { Button } from '@/components/ui/button'
</script>

<template>
  <MainNav />
  <MainTable />
  <div class="flex mx-auto w-4/5  items-center space-x-4 justify-center">
        <Button class="" @click="Files.problem.open()">Import Problem</Button>
        <Button class="" @click="Files.problem.saveAs()">Export Problem</Button>
        <Button class="" @click="Files.answer.open()">Import Answer</Button>
        <Button class="" @click="Files.answer.saveAs()">Export Answer</Button>
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
