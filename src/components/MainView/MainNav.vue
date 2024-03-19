<script setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


import MaterialSymbolsSettings from '@/components/icons/MaterialSymbolsSettings.vue';
import { reactive } from 'vue';


import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

//TODO: 透传
const settings = reactive({
    'quantity': 10,  // 数量
    'range': null, // 范围
    'operators': {
        'add': true,  // 加法
        'sub': true,  // 减法
        'mul': true,  // 乘法
        'div': true,  // 除法
    },
    'autoCheck': false,  // 自动检查
    'showAnswer': false,  // 显示答案
})

// TODO: 逻辑

</script>


<template>

    <Sheet>
        <SheetTrigger>
            <Button class="size-12 m-8">
                <MaterialSymbolsSettings class="text-xl" />
            </Button>
        </SheetTrigger>
        <SheetContent side="left">
            <SheetHeader>
                <SheetTitle>设置</SheetTitle>
                <!-- <SheetDescription>设置你的偏好设置
                </SheetDescription> -->
            </SheetHeader>
            <div class="pt-10 pl-2 space-y-5 b">

                <div class="flex space-x-4 items-center  h-10 m-auto">
                    <Label class="" for="quantity">题目个数</Label>
                    <Input class="pl-0 w-auto" id="quantity" type="number" v-model="settings.quantity" />
                    <!-- TODO:Input box number center -->
                </div>

                <div class="flex space-x-4 items-center  h-10 m-auto">
                    <Label class="" for="quantity">数值范围</Label>
                    <Input class="pl-0 w-auto" id="range" type="number" v-model="settings.range" />
                </div>



                <div id='autoCheck' class="flex space-x-4 items-center  h-10 m-auto">
                    <Label for="autoCheck"
                        class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">自动检查</Label>
                    <Switch :checked="settings.autoCheck" @update:checked="settings.autoCheck = !settings.autoCheck" />
                </div>

                <div id='showAnswer' class="flex space-x-4 items-center h-10 m-auto">
                    <Label for="showAnswer"
                        class="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">显示答案</Label>
                    <Switch :checked="settings.showAnswer"
                        @update:checked="settings.showAnswer = !settings.showAnswer" />
                </div>

                <!-- TODO: 上传文件逻辑 -->
                <Input type="file" />

                <div class="border rounded-md space-y-2">
                    <Label for="operators" class="text-center">运算符</Label>
                    <div id='operators' class="flex  space-x-2.5 h-10 items-center justify-between p-2">
                        <Checkbox id="add" :checked="settings.operators.add"
                            @update:checked="settings.operators.add = $event; console.log($event)" />
                        <Label for="add">加法</Label>

                        <Checkbox id="sub" :checked="settings.operators.sub"
                            @update:checked="settings.operators.sub = $event" />
                        <Label for="sub">减法</Label>

                        <Checkbox id="mul" :checked="settings.operators.mul"
                            @update:checked="settings.operators.mul = $event" />
                        <Label for="mul">乘法</Label>

                        <Checkbox id="div" :checked="settings.operators.div"
                            @update:checked="settings.operators.div = $event" />
                        <Label for="div">除法</Label>
                    </div>
                </div>
            </div>
        </SheetContent>
    </Sheet>
</template>