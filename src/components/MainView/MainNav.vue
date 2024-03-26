<script setup>
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import OperatorsSelector from "@/components/MainView/OperatorsSelector.vue";
import { reactive } from 'vue';
import Generator from '@/scripts/problem';

//TODO: 透传
const settings = reactive({
    quantity: 10,
    range: 10,
    operators: {
        add: true,
        sub: true,
        mul: true,
        div: true
    },
    autoCheck: true,
    showAnswer: true,
    probability: {
        integer: 0.5,
        fraction: {
            mixedFraction: 0.5
        }
    }
})



// TODO: 逻辑
function toGenerate() {
    const gen = new Generator(settings)
    gen.generate()
    console.log(gen.problemsList)
}

</script>


<template>
    <div class="flex flex-col items-center mx-auto mb-10 space-y-5 b w-80 text-gray-800">
        <div class="flex space-x-4 items-center h-10 m-auto">
            <Label for="quantity">题目个数</Label>
            <Input class="pl-0 w-auto" id="quantity" type="number" v-model="settings.quantity" />
            <!-- TODO:Input box number center -->
        </div>
        <div class="flex space-x-4 items-center  h-10 m-auto">
            <Label for="quantity">数值范围</Label>
            <Input class="pl-0 w-auto" id="range" type="number" v-model="settings.range" />
        </div>
        <!-- TODO: 事件处理 -->
        <OperatorsSelector v-model:operators="settings.operators" />
        <Button class="w-60" @click="toGenerate">Generate</Button>
    </div>
</template>