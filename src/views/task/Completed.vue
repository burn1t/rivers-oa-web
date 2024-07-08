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
                        <a-button type="primary" @click="handleGetCompletedTaskList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     size="small"
                     :data-source="completedTaskList.list"
                     :columns="completedTaskListColumn"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{column, text, record}">
                    <template v-if="column.title === '所属流程'">
                        {{ `${record['processName']} - v${record['version']}` }}
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button type="link" size="small"
                                  @click="handleApprovalHistoryModalVisible(record)">审批历史</a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="completedTaskList.total"
                          show-size-changer
                          simple/>
        </div>
    </div>

    <approval-history :visible="approvalHistoryModalVisible"
                      :business-key="businessKey"
                      :process-instance-id="processInstanceId"
                      @update:visible="approvalHistoryModalVisible = $event"></approval-history>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import {getCompletedTaskList} from '@/api'
import {ApprovalHistory} from '@/components'
import {completedTaskListColumn} from '@/data'

const approvalHistoryModalVisible = ref(false)
const completedTaskList = reactive({
    total: 0,
    list: []
})
const queryFormInfo = reactive({
    taskName: '',
    current: 1,
    size: 5
})

// 当前应用列数据
const businessKey = ref('')
const processInstanceId = ref('')

const resetCurrent = () => {
    businessKey.value = ''
    processInstanceId.value = ''
}

const handleGetCompletedTaskList = async () => {
    completedTaskList.total = 0
    completedTaskList.list.splice(0, completedTaskList.list.length)
    const {code, result} = await getCompletedTaskList(queryFormInfo)
    if (code === 20000) {
        completedTaskList.total = result.total
        result['records'].forEach(item => {
            item['index'] = `${result['records'].indexOf(item) + 1}`
            completedTaskList.list.push(item)
        })
    }
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
    handleGetCompletedTaskList()
}

handleGetCompletedTaskList()

watch(() => approvalHistoryModalVisible.value, value => {
    if (!value) {
        resetCurrent()
        handleGetCompletedTaskList()
    }
})
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>
