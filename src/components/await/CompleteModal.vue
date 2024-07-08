<template>
    <a-modal
        width="800px"
        :open="visible"
        ok-text="提交"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel">
        <h1>通过任务</h1>
        <div class="content-box">
            <a-form :model="formInfo"
                    :label-col="{ style: {width: '125px'} }"
                    :wrapper-col="{ span: 25 }">
                <a-form-item label="审批意见" :colon="false" labelAlign="left">
                    <a-textarea placeholder="输入审批意见"
                                autocomplete="off"
                                showCount
                                :maxlength="200"
                                :auto-size="{minRows: 6, maxRows: 6}"
                                v-model:value="formInfo.message"/>
                </a-form-item>
                <template v-if="nextTaskNodeList.length > 0">
                    <span>指定后续节点审批人</span>
                    <description>说明：可选择多个用户</description>
                </template>

                <template v-for="item in nextTaskNodeList" :key="item['id']">
                    <a-form-item :label="item['nodeName']" :colon="false" labelAlign="left">
                        <a-select style="width: 100%"
                                  mode="multiple"
                                  placeholder="选择审批人"
                                  :max-tag-text-length="10"
                                  :options="options"
                                  v-model:value="formInfo.assigneeMap[item.id]"
                        ></a-select>
                    </a-form-item>
                </template>

            </a-form>
        </div>
    </a-modal>
</template>

<script setup>
import {ref, reactive, watch} from 'vue'
import {getTaskNodeInfo, completeTask} from '@/api'
import {message} from 'ant-design-vue'
import {Description} from '@/components'
import {candidateUser} from '@/data'

const props = defineProps({
    visible: Boolean,
    taskId: String
})
const emit = defineEmits(['update:visible'])

const options = ref(candidateUser)
const nextTaskNodeList = ref([])
const formInfo = reactive({
    taskId: '',
    message: '',
    assigneeMap: {}
})


const resetModuleData = () => {
    nextTaskNodeList.value.splice(0, nextTaskNodeList.value.length)
    formInfo.taskId = ''
    formInfo.message = ''
    formInfo.assigneeMap = {}
}

const handleGetTaskNodeInfo = async () => {
    const {code, result} = await getTaskNodeInfo(props.taskId)
    if (code === 20000) nextTaskNodeList.value = result
}

const handleOk = async () => {
    formInfo.taskId = props.taskId
    const {code, information} = await completeTask(formInfo)
    if (code === 20000) message.success(information)
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('update:visible', false)
}



watch(() => props.visible, value => {
    if (value) handleGetTaskNodeInfo()
    else resetModuleData()
})
</script>

<style scoped lang="less">

</style>