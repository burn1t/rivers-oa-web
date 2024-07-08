<template>
    <a-modal wrap-class-name="full-modal"
             width="100%"
             :open="visible"
             ok-text="提交"
             :footer="null"
             @cancel="handleCancel">
        <h1>流程审批历史跟踪</h1>
        <a-tabs v-model:activeKey="activeKey" centered>
            <a-tab-pane class="tab-pane-first" key="1" tab="业务单据">
                <component :is="formList[currentFormIndex]"
                           :operate="'details'"
                           :business-key="businessKey"
                           :opposite-end="false"/>
            </a-tab-pane>
            <a-tab-pane key="2" tab="流程审批进度" force-render>
                <div class="center-box">
                    <div class="table-container">
                        <a-table style="width: 1100px;"
                                 rowClassName="table-row-style"
                                 size="small"
                                 bordered
                                 :pagination="false"
                                 :columns="taskHistoryColumn"
                                 :data-source="taskHistoryInfoList">
                            <template #title>流程审批历史记录</template>
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.dataIndex === 'status'">
                                    <a-tag :color="isProcessed(record['status'])">
                                        {{ record['status'] }}
                                    </a-tag>
                                </template>
                            </template>
                        </a-table>
                    </div>

                    <div class="img-container">
                        <div v-html="historyImgSvgCode"></div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {getFormName, getTaskHistoryInfoList, getProcessHistoryImg} from '@/api'
import {LeaveForm, LoanForm} from '@/components'
import {taskHistoryColumn} from '@/data'

const props = defineProps({
    visible: Boolean,
    businessKey: String,
    processInstanceId: String
})
const emit = defineEmits(['update:visible'])

const activeKey = ref('1')
const taskHistoryInfoList = ref([])
const historyImgSvgCode = ref(`<div></div>`)
// 渲染 form
const formList = [LeaveForm, LoanForm]
const currentFormName = ref('')
const currentFormIndex =
    computed(() => formList.findIndex(form => form['__name'] === 'LeaveForm'))

const isProcessed = (status) => {
    if (status === '待处理') return 'blue'
    if (status === '已驳回') return 'orange'
    else return 'green'
}

const handleCancel = () => {
    activeKey.value = '1'
    currentFormName.value = ''
    taskHistoryInfoList.value.splice(0, taskHistoryInfoList.value.length)
    emit('update:visible', false)
}

const handleGetFormName = async () => {
    const instanceId = props.processInstanceId
    const {code, result: {formName}} = await getFormName(instanceId)
    if (code === 20000) currentFormName.value = formName
}

const handleGetTaskHistoryInfoList = async () => {
    const instanceId = props.processInstanceId
    try {
        const {code, result} = await getTaskHistoryInfoList(instanceId)
        if (code === 20000) {
            result.forEach(item => {
                item['index'] = `${result.indexOf(item) + 1}`
                taskHistoryInfoList.value.push(item)
            })
            console.log(taskHistoryInfoList.value)
        }
    } catch (e) {
        console.log(e)
    }
}

const getHistoryImg = async () => {
    const {data} = await getProcessHistoryImg(props.processInstanceId)
    historyImgSvgCode.value = data
}

watch(() => props.visible, value => {
    if (value) {
        handleGetFormName()
        handleGetTaskHistoryInfoList()
        getHistoryImg()
    }
})

</script>

<style scoped lang="less">
.tab-pane-first {
    padding: 0 300px
}

.center-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 1150px;
    margin: 0 auto;

    .table-container {
        width: 1100px;
    }

    .img-container {
        width: 75%;
    }
}
</style>