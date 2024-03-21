<script setup>
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


import MaterialSymbolsSettings from '@/components/icons/MaterialSymbolsSettings.vue';
import OperatorsSelector from "@/components/MainView/OperatorsSelector.vue";
import { reactive, defineEmits } from 'vue';


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
    'range': 10, // 范围
    'operators': {
        'add': true,  // 加法
        'sub': true,  // 减法
        'mul': true,  // 乘法
        'div': false,  // 除法
    },
    'autoCheck': false,  // 自动检查
    'showAnswer': false,  // 显示答案
})

let allProblem = []
const emit = defineEmits(['getProblem'])
let importedProblemContent = []

const props = defineProps({
    importedProblem: {
        type: String,
        default: ''
    }
})

// TODO: 逻辑
function toGenerate() {
    // 参与运算的操作数个数
    let amountOfOperands = 0
    for (let key in settings.operators) {
        if (settings.operators[key] === true) amountOfOperands++
    }
    if (!amountOfOperands || amountOfOperands === 4) return
    amountOfOperands++

    generateAllProblems(settings.quantity, amountOfOperands, settings.range)
    console.log(allProblem);
}

/**
 * 生成[0, max)内的随机整数
 * @param {number} range 最大数值范围
 */
function generateRandomInt(range) {
    return Math.floor(Math.random() * range)
}

/**
 * 生成分数
 * @param {number} range 最大数值范围
 */
function generateRandomFraction(range) {
    // 分子 [0, range-1)
    let numerator = generateRandomInt(range - 1)
    // 分母 确保不为0 [1, range)
    let denominator = generateRandomInt(range - 1) + 1
    // 分子必须小于分母 且分子不为0（如果为0相当于生成了整数0）
    while (numerator >= denominator || numerator === 0) {
        numerator = generateRandomInt(range - 1)
        denominator = generateRandomInt(range - 1) + 1
    }

    // 生成带分数的整数部分 （带分数如1'2/3）
    let integer = generateRandomInt(range)
    // 整数部分不为0（如果为0相当于生成的是真分数）
    while (integer === 0) {
        integer = generateRandomInt(range)
    }

    // 随机返回真分数或带分数
    if (Math.random() > 0.5) {
        return `${integer}'${numerator}/${denominator}`
    } else {
        return `${numerator}/${denominator}`
    }
}

// 生成操作符
function generateOperator() {
    // 获取settings.operators里为属性值true的属性名
    const keys = Object.keys(settings.operators).filter(key => settings.operators[key])
    const operator = keys[Math.floor(Math.random() * keys.length)]
    switch (operator) {
        case 'add': return '+'
        case 'sub': return '-'
        case 'mul': return '*'
        case 'div': return '/'
        default: return;
    }
}

/**
 * 生成一道题目
 * @param {number} amountOfOperands 一道题中的操作数个数
 * @param {number} range 最大数值范围
 */
function generateAProblem(amountOfOperands, range) {
    let expression = ''
    let numArr = []
    let operatorArr = []
    // 生成操作数
    for (let i = 0; i < amountOfOperands; i++) {
        let num
        if (range > 2) {
            num = Math.random() > 0.5 ? generateRandomInt(range) : generateRandomFraction(range)
        } else num = generateRandomInt(range)
        numArr.push(num)
    }
    // 生成操作符
    for (let i = 0; i < amountOfOperands - 1; i++) operatorArr.push(generateOperator())
    // 拼接
    for (let i = 0; i < numArr.length; i++) {
        expression += numArr[i]
        if (i !== numArr.length - 1) expression += ` ${operatorArr[i]} `
    }
    return expression
}

/**
 * 根据需要的数量生成全部题目
 * @param {number} quantity  题目数量
 * @param {number} amountOfOperands 一道题中的操作数个数
 * @param {number} range 最大数值范围
 */
function generateAllProblems(quantity, amountOfOperands, range) {
    // 清零
    allProblem = []
    for (let i = 0; i < quantity; i++) {
        allProblem.push(generateAProblem(amountOfOperands, range))
    }
    // 向父组件传值
    emit('getProblem', allProblem)
}

// 处理导入的问题 换成数组格式
function handleImportedProblem() {
    importedProblemContent = props.importedProblem.split('\n')
    // 删除数组最后一个元素（是换行符）
    importedProblemContent.pop()

    // 去掉开头的序号
    importedProblemContent.forEach((item, index) => {
        importedProblemContent[index] = item.replace(/^\d+\.\s*/, '')
    })
}
</script>


<template>

    <Sheet>
        <SheetTrigger>
            <Button class="size-12 m-8">
                <MaterialSymbolsSettings class="text-xl" />
            </Button>
        </SheetTrigger>
        <SheetContent side="left">~
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
                <!-- TODO: 事件处理 -->
                <OperatorsSelector v-model:add="settings.operators.add" v-model:sub="settings.operators.sub"
                    v-model:mul="settings.operators.mul" v-model:div="settings.operators.div" />

                <Button @click="toGenerate">Generate</Button>
            </div>
        </SheetContent>
    </Sheet>
</template>