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
                                  @click="handleGetFinishProcessInstanceList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     :scroll="{ x: '155%' }"
                     :data-source="finishProcessInstanceList.list"
                     :columns="finishProcessColumn"
                     size="small"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{column, text, record}">
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag :color="businessStatusTagColor(record['status'])">
                            {{businessStatusTagStr(record['status'])}}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-space :size="15">
                            <a-button class="physical-button" type="primary" size="small"
                                      @click="handleApprovalHistoryModalVisible(record)">审批历史</a-button>
                            <a-button class="physical-button" size="small" danger
                                      @click="handleDeleteInstanceHistoryNotification(record)">删除</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
            <a-pagination class="pagination"
                          v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="finishProcessInstanceList.total"
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
import {getFinishProcessInstanceList, deleteFinishProcessHistory} from '@/api'
import {Button, message, notification} from 'ant-design-vue'
import {ApprovalHistory} from '@/components'
import {finishProcessColumn} from '@/data'

const finishProcessInstanceList = reactive({
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

// 判断业务状态标签颜色
const businessStatusTagColor = status => {
    if (status === 0) return 'pink'
    else if (status === 1) return 'blue'
    else if (status === 2) return 'orange'
    else if (status === 3) return 'green'
    else if (status === 4 || 5) return 'red'
}
const businessStatusTagStr = status => {
    if (status === 0) return '已撤回'
    else if (status === 1) return '待提交'
    else if (status === 2) return '处理中'
    else if (status === 3) return '已完成'
    else if (status === 4) return '已作废'
    else if (status === 5) return '已删除'
}

const resetCurrent = () => {
    businessKey.value = ''
    processInstanceId.value = ''
}

const handleGetFinishProcessInstanceList = async () => {
    finishProcessInstanceList.total = 0
    finishProcessInstanceList.list.splice(0, finishProcessInstanceList.list.length)
    const {code, result} = await getFinishProcessInstanceList(queryFormInfo)
    if (code === 20000) {
        finishProcessInstanceList.total = result.total
        result['records'].forEach(item => {
            item['index'] = `${result['records'].indexOf(item) + 1}`
            finishProcessInstanceList.list.push(item)
        })
    }
}

// 审批历史
const handleApprovalHistoryModalVisible = (record) => {
    businessKey.value = record['businessKey']
    processInstanceId.value = record['processInstanceId']
    approvalHistoryModalVisible.value = true
}

// 删除
const handleDeleteInstanceHistoryNotification = (record) => {
    const id = record['processInstanceId']
    const name = record['processInstanceName']
    const key = record['processKey']
    notification.open({
        message: `是否删除 [${name}-${key}] 流程实例审批历史记录`,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                danger: true,
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleDeleteInstanceHistory(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

const handleDeleteInstanceHistory = async (id) => {
    const {code, information} = await deleteFinishProcessHistory(id)
    if (code === 20000) message.success(information)
    notification.close(id)
    await handleGetFinishProcessInstanceList()
}


const resetFormInfo = () => {
    queryFormInfo.processName = ''
    queryFormInfo.proposer = ''
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetFinishProcessInstanceList()
}

handleGetFinishProcessInstanceList()

watch(() => approvalHistoryModalVisible.value, value => {
    if (!value) {
        resetCurrent()
        handleGetFinishProcessInstanceList()
    }
})
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>
