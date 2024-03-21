<script setup>
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { defineProps, computed, defineEmits } from 'vue';

const props = defineProps({
    operators: {
        type: Object,
    }
});

const emit = defineEmits(['update:operators']);

const ops = computed({
    get: () => props.operators,
    set: (value) => {
        emit('update:operators', value);
    }
});

</script>

<template>
    <div class="space-y-2.5">
        <Label for="operators" class="text-center">运算符</Label>
        <!-- TODO: 检查输入提示 -->
        <div id='operators' class="flex  space-x-2.5 h-10 items-center justify-between p-2">
            <Checkbox id="add" v-model:checked="ops.add" />
            <Label for="add">加法</Label>

            <Checkbox id="sub" v-model:checked="ops.sub" />
            <Label for="sub">减法</Label>

            <Checkbox id="mul" v-model:checked="ops.mul" />
            <Label for="mul">乘法</Label>

            <Checkbox id="div" v-model:checked="ops.div" />
            <Label for="div">除法</Label>
        </div>
    </div>
</template>