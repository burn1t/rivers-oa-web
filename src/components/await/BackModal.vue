<template>
    <a-modal
        width="460px"
        :open="visible"
        ok-text="提交"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel">
        <h1>驳回审批</h1>
        <div class="content-box">
            <description>说明：驳回至指定的、已完成的任务节点</description>
            <a-form>
                <a-form-item label="驳回至" :colon="false">
                    <a-select placeholder="指定任务节点"
                              :options="options"
                              v-model:value="targetTaskId"></a-select>
                </a-form-item>
            </a-form>

        </div>
    </a-modal>
</template>

<script setup>
import {ref, watch} from 'vue'
import {getBackTaskHistoryList, backToTargetTask} from '@/api'
import {message} from 'ant-design-vue'
import {Description} from '@/components'

const props = defineProps({
    visible: Boolean,
    taskId: String
})
const emit = defineEmits(['update:visible'])
const options = ref([])
const targetTaskId = ref(undefined)

const handleGetTaskHistoryList = async () => {
    const taskId = props.taskId
    const {code, result} = await getBackTaskHistoryList(taskId)
    if (code === 20000)
        result.forEach(item => {
            options.value.push({
                label: item['activityName'],
                value: item['activityId']
            })
        })
}

const handleOk = async () => {
    const {code, information} = await backToTargetTask(props.taskId, targetTaskId.value)
    if (code === 20000) message.success(information)
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('update:visible', false)
}

watch(() => props.visible, value => {
    if (value) handleGetTaskHistoryList()
    else {
        targetTaskId.value = undefined
        options.value.splice(0, options.value.length)
    }
})
</script>

<style scoped lang="less">
.a-select {
    width: 100%;
}
</style>