<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
                    :label-col="{style: { marginRight: '5px'}}"
                    :model="queryFormInfo">
                <a-form-item label="任务名称" labelAlign="left">
                    <a-input placeholder="请输入任务名称"
                             autocomplete="off"
                             v-model:value="queryFormInfo.taskName"/>
                </a-form-item>
                <a-form-item>
                    <a-space :size="15">
                        <a-button type="primary" @click="handleGetAwaitTaskList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     size="small"
                     :data-source="awaitTaskList.list"
                     :columns="awaitTaskListColumn"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{column, text, record}">
                    <template v-if="column.title === '所属流程'">
                        {{ `${record['processName']} - v${record['version']}` }}
                    </template>
                    <template v-if="column.dataIndex === 'processStatus'">
                        <a-tag :color="taskStatusTagColor(record['processStatus'])">
                            {{ taskStatusTagStr(record['processStatus']) }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button type="link" size="small"
                                  v-if="!record['taskAssignee']"
                                  @click="handleClaimNotice(record)">签收
                        </a-button>
                        <a-button type="link" size="small"
                                  v-else
                                  @click="handleCompleteModalVisible(record)">通过
                        </a-button>
                        <a-button type="link" size="small"
                                  v-if="record['taskAssignee']"
                                  @click="handleTurnModelVisible(record)">转办
                        </a-button>
                        <a-button type="link" size="small"
                                  v-if="record['taskAssignee']"
                                  @click="handleBackModalVisible(record)">驳回
                        </a-button>
                        <a-button type="link" size="small"
                                  @click="handleApprovalHistoryModalVisible(record)">审批历史
                        </a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="awaitTaskList.total"
                          show-size-changer
                          simple/>
        </div>
    </div>

    <complete-modal :visible="completeModalVisible"
                    :task-id="taskId"
                    @update:visible="completeModalVisible = $event"></complete-modal>

    <turn-modal :visible="turnModalVisible"
                :task-id="taskId"
                :current-assignee="assignee"
                @update:visible="turnModalVisible = $event"></turn-modal>

    <back-modal :visible="backModalVisible"
                :task-id="taskId"
                @update:visible="backModalVisible = $event"></back-modal>

    <approval-history :visible="approvalHistoryModalVisible"
                      :business-key="businessKey"
                      :process-instance-id="processInstanceId"
                      @update:visible="approvalHistoryModalVisible = $event"></approval-history>
</template>

<script setup>
import {ref, reactive, h, watch} from 'vue'
import {getWaitingTaskList, claimTask} from '@/api'
import {CompleteModal, TurnModal, BackModal, ApprovalHistory} from '@/components'
import {Button, message, notification} from 'ant-design-vue'
import {awaitTaskListColumn} from '@/data'

const completeModalVisible = ref(false)
const turnModalVisible = ref(false)
const backModalVisible = ref(false)
const approvalHistoryModalVisible = ref(false)
// 查询
const awaitTaskList = reactive({
    total: 0,
    list: []
})
const queryFormInfo = reactive({
    taskName: '',
    current: 1,
    size: 5
})
// current
const taskId = ref('')
const businessKey = ref('')
const processInstanceId = ref('')
const assignee = ref('')

const taskStatusTagColor = status => {
    if (status) return 'orange'
    else return 'green'
}

const taskStatusTagStr = status => {
    if (status) return '已挂起'
    else return '已激活'
}

const resetCurrent = () => {
    taskId.value = ''
    businessKey.value = ''
    processInstanceId.value = ''
    assignee.value = ''
}

const handleGetAwaitTaskList = async () => {
    awaitTaskList.total = 0
    awaitTaskList.list.splice(0, awaitTaskList.list.length)
    const {code, result} = await getWaitingTaskList(queryFormInfo)
    if (code === 20000) {
        awaitTaskList.total = result.total
        result['records'].forEach(item => {
            item['index'] = `${result['records'].indexOf(item) + 1}`
            awaitTaskList.list.push(item)
        })
    }
}

// 签收任务
const handleClaimNotice = (record) => {
    const taskId = record['taskId']
    const proposer = record['proposer']
    notification.open({
        message: `是否签收 [${proposer}] 发起的任务`,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleClaimTask(taskId)
            }, {
                default: () => '确定',
            }),
        key: taskId,
    })
}

const handleClaimTask = async (taskId) => {
    const {code, information} = await claimTask(taskId)
    if (code === 20000) message.success(information)
    notification.close(taskId)
    await handleGetAwaitTaskList()
}

// 通过任务
const handleCompleteModalVisible = (record) => {
    taskId.value = record.taskId
    completeModalVisible.value = true
}

// 转办任务
const handleTurnModelVisible = (record) => {
    taskId.value = record['taskId']
    assignee.value = record['taskAssignee']
    turnModalVisible.value = true
}

// 驳回任务
const handleBackModalVisible = (record) => {
    taskId.value = record['taskId']
    backModalVisible.value = true
}

// 审批历史
const handleApprovalHistoryModalVisible = (record) => {
    businessKey.value = record['businessKey']
    processInstanceId.value = record['processInstanceId']
    approvalHistoryModalVisible.value = true
}

const resetFormInfo = () => {
    queryFormInfo.taskName = ''
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetAwaitTaskList()
}

handleGetAwaitTaskList()

watch(() => [completeModalVisible.value,
    turnModalVisible.value,
    backModalVisible.value,
    approvalHistoryModalVisible.value], value => {
    if (value.every(item => item === false)) {
        resetCurrent()
        handleGetAwaitTaskList()
    }
})
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>
