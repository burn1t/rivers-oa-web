<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
                    :label-col="{style: { marginRight: '5px'}}"
                    :model="queryFormInfo">
                <a-form-item label="流程名称" labelAlign="left">
                    <a-input placeholder="输入流程名称"
                             autocomplete="off"
                             v-model:value="queryFormInfo.processName"/>
                </a-form-item>
                <a-form-item label="流程发起人" labelAlign="left">
                    <a-input placeholder="输入流程发起人名称"
                             @click.prevent
                             v-model:value="queryFormInfo.proposer"/>
                </a-form-item>
                <a-form-item>
                    <a-space :size="15">
                        <a-button type="primary"
                                  @click="handleGetRunningProcessInstanceList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     :scroll="{x: '135%'}"
                     :data-source="runningProcessInstanceList.list"
                     :columns="runningProcessColumn"
                     size="small"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{column, text, record}">
                    <template v-if="column.dataIndex === 'processStatus'">
                        <a-tag :color="statusTagColor(record['processStatus'])">
                            {{record['processStatus'] ? '已暂停' : '已启动'}}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-space :size="15">
                            <a-button class="physical-button" type="primary" size="small"
                                      @click="handleUpdateInstanceStateNotification(record)">
                                {{record['processStatus'] ? '激活' : '挂起'}}</a-button>
                            <a-button class="physical-button" size="small" danger
                                      @click="handleDeleteInstanceNotification(record)">作废</a-button>
                            <a-button type="primary" size="small"
                                      @click="handleApprovalHistoryModalVisible(record)">审批历史</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
            <a-pagination class="pagination"
                          v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="runningProcessInstanceList.total"
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
import {h, reactive, ref, watch} from 'vue'
import {getRunningProcessInstanceList, updateProcessInstanceState, deleteProcessInstance,} from '@/api'
import {Button, message, notification} from 'ant-design-vue'
import {ApprovalHistory} from '@/components'
import {runningProcessColumn} from '@/data'

const runningProcessInstanceList = reactive({
    total: 0,
    list: []
})
const queryFormInfo = reactive({
    processName: '',
    proposer: '',
    current: 1,
    size: 5
})
const approvalHistoryModalVisible = ref(false)
// 当前应用列数据
const businessKey = ref('')
const processInstanceId = ref('')

const statusTagColor = (status) => {
    if (status) return 'orange'
    else return 'green'
}

const resetCurrent = () => {
    businessKey.value = ''
    processInstanceId.value = ''
}

const handleGetRunningProcessInstanceList = async () => {
    runningProcessInstanceList.total = 0
    runningProcessInstanceList.list.splice(0, runningProcessInstanceList.list.length)
    console.log(queryFormInfo)
    const {code, result} = await getRunningProcessInstanceList(queryFormInfo)
    if (code === 20000) {
        runningProcessInstanceList.total = result.total
        result['records'].forEach(item => {
            item['index'] = `${result['records'].indexOf(item) + 1}`
            runningProcessInstanceList.list.push(item)
        })
    }

}

const resetFormInfo = () => {
    queryFormInfo.processName = ''
    queryFormInfo.proposer = ''
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetRunningProcessInstanceList()
}

// 更新流程实例状态
const handleUpdateInstanceStateNotification = (record) => {
    const id = record.processInstanceId
    const state = record.state ? '激活' : '挂起'
    const description = record.state ? '激活后此流程实例的任务允许审批' : ' 挂起后此流程实例的任务不允许审批'
    notification.open({
        message: `是否${state}流程实例 [${id}]`,
        description: description,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleUpdateInstanceState(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

const handleUpdateInstanceState = async (id) => {
    console.log(id)
    const {code, information} = await updateProcessInstanceState(id)
    if (code === 20000) message.success(information)
    notification.close(id)
    await handleGetRunningProcessInstanceList()
}

// 作废流程实例
const handleDeleteInstanceNotification = (record) => {
    const id = record['processInstanceId']
    const name = record['processInstanceName']
    const key = record['processKey']
    const version = record['version']
    // const
    notification.open({
        message: `是否删除流程定义 [${name}-${key}-v${version}]`,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                danger: true,
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleDeleteInstance(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

const handleDeleteInstance = async (id) => {
    console.log(id)
    const {code, information} = await deleteProcessInstance(id)
    if (code === 20000) message.success(information)
    notification.close(id)
    await handleGetRunningProcessInstanceList()
}

// 审批历史
const handleApprovalHistoryModalVisible = (record) => {
    businessKey.value = record['businessKey']
    processInstanceId.value = record['processInstanceId']
    approvalHistoryModalVisible.value = true
}


watch(() => approvalHistoryModalVisible.value, value => {
    if (!value) {
        resetCurrent()
        handleGetRunningProcessInstanceList()
    }
})

handleGetRunningProcessInstanceList()
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>
