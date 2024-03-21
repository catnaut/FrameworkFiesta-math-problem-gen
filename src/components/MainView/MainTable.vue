<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

import { Button } from '@/components/ui/button'
// 所有数据
const tableData = [
  {
    index: '1',
    problem: '1+2',
    answer: '1',
  },
  {
    index: '2',
    problem: '3+4+5',
    answer: '1',
  },
  {
    index: '3',
    problem: '2+3+4+5',
    answer: '1',
  },
  {
    index: '4',
    problem: '1+1',
    answer: '1',
  },
  {
    index: '5',
    problem: '1+1',
    answer: '1',
  },
//   {
//     index: '6',
//     problem: '1+1',
//     answer: '1',
//   },
//   {
//     index: '7',
//     problem: '1+1',
//     answer: '1',
//   },
//   {
//     index: '8',
//     problem: '1+1',
//     answer: '1',
//   },
//   {
//     index: '9',
//     problem: '1+1',
//     answer: '1',
//   },
//   {
//     index: '10',
//     problem: '1+1',
//     answer: '1',
//   },
//   {
//     index: '11',
//     problem: '1+1',
//     answer: '1',
//   },
]

// 按分页条件过滤后的数据
// const filteredData = []
</script>

<template>
  <div class="w-4/5 mx-auto flex flex-col items-center">
    <Table class="border">
        <TableHeader class="bg-gray-100">
        <TableRow>
            <TableHead class="w-1/5 text-center">Index</TableHead>
            <TableHead class="w-2/5 text-center">Problem</TableHead>
            <TableHead class="w-2/5 text-center">Answer</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        <TableRow v-for="data in tableData" :key="data.index">
            <TableCell class="font-medium  text-center">
            {{ data.index }}
            </TableCell>
            <TableCell class="text-center">{{ data.problem }}</TableCell>
            <TableCell class="text-center">
            {{ data.answer }}
            </TableCell>
        </TableRow>
        </TableBody>
    </Table>

    <Pagination v-slot="{ page }" :total="tableData.length" :sibling-count="1" show-edges :default-page="1" class="my-10">
        <PaginationList v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst />
        <PaginationPrev />

        <template v-for="(item, index) in items">
            <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-10 h-10 p-0 m-1" :variant="item.value === page ? 'default' : 'outline'">
                {{ item.value }}
            </Button>
            </PaginationListItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
        </PaginationList>
    </Pagination>
  </div>
</template>

<style>

</style>
