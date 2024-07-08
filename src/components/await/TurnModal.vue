<template>
    <a-modal
        width="460px"
        :open="visible"
        ok-text="提交"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel">
        <h1>转办任务</h1>
        <div class="content-box">
            <description>说明：只可选择单个用户</description>
            <a-form>
                <a-form-item label="审批人姓名" :colon="false">
                    <a-select placeholder="选择审批人"
                              :max-tag-text-length="10"
                              :options="optionsExclude"
                              v-model:value="assignee"></a-select>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {ref, computed} from 'vue'
import {turnTask} from '@/api'
import {message} from 'ant-design-vue'
import {Description} from '@/components'
import {candidateUser} from '@/data'

const props = defineProps({
    visible: Boolean,
    taskId: String,
    currentAssignee: String
})
const emit = defineEmits(['update:visible'])

const options = ref(candidateUser)
const assignee = ref('')

// 选项排除当前办理人
const optionsExclude = computed(() => {
    return options.value.filter(option =>
        option['value'] !== props.currentAssignee)
})

const handleOk = async () => {
    const taskId = props.taskId
    const assigneeVal = assignee.value
    if (assigneeVal.length === 0) return message.error('审批人姓名不能为空', 5)

    const {code, information} = await turnTask(taskId, assigneeVal)
    if (code === 20000) message.success(information)
    assignee.value = ''
    emit('update:visible', false)
}

const handleCancel = () => {
    assignee.value = ''
    emit('update:visible', false)
}
</script>

<style scoped lang="less">
.ant-select {
    width: 100%;
}
</style>