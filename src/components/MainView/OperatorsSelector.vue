<script setup>
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { defineModel, defineEmits, watch } from 'vue';


const add = defineModel('add', { type: Boolean, default: false });
const sub = defineModel('sub', { type: Boolean, default: false });
const mul = defineModel('mul', { type: Boolean, default: false });
const div = defineModel('div', { type: Boolean, default: false });

const emit = defineEmits(['invalid:not-allow-all-select', 'invalid:not-allow-no-select']);

function checkSelect() {
    // no allow no select
    if (!add.value && !sub.value && !mul.value && !div.value) {
        emit('invalid:not-allow-no-select');
        console.log('invalid:not-allow-no-select');
    }
    // no allow all select
    else if (add.value && sub.value && mul.value && div.value) {
        emit('invalid:not-allow-all-select');
        console.log('invalid:not-allow-all-select');
    }
};

watch([add, sub, mul, div], () => {
    checkSelect();
});

</script>

<template>
    <div class="border rounded-md space-y-2">
        <Label for="operators" class="text-center">运算符</Label>
        <!-- TODO: 检查输入提示 -->
        <div id='operators' class="flex  space-x-2.5 h-10 items-center justify-between p-2">
            <Checkbox id="add" :checked="add" @update:checked="add = $event;" />
            <Label for="add">加法</Label>

            <Checkbox id="sub" :checked="sub" @update:checked="sub = $event" />
            <Label for="sub">减法</Label>

            <Checkbox id="mul" :checked="mul" @update:checked="mul = $event" />
            <Label for="mul">乘法</Label>

            <Checkbox id="div" :checked="div" @update:checked="div = $event" />
            <Label for="div">除法</Label>
        </div>
    </div>
</template>