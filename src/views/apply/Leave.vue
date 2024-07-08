<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
                    :label-col="{style: { marginRight: '5px'}}"
                    :model="queryFormInfo">
                <a-form-item label="标题" labelAlign="left">
                    <a-input placeholder="请输入标题名称"
                             autocomplete="off"
                             v-model:value="queryFormInfo.title"/>
                </a-form-item>
                <a-form-item label="流程标识" labelAlign="left">
                    <a-select id="type"
                              autocomplete="off"
                              placeholder="选择一个业务状态"
                              v-model:value="queryFormInfo.status"
                              :options="businessStatusTypeOptions"></a-select>
                </a-form-item>
                <a-form-item>
                    <a-space :size="15">
                        <a-button type="primary" @click="handleGetLeaveList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-button type="primary" @click="handleLeaveFormModalVisible('add', '')">
                <PlusOutlined/>新增申请</a-button>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     :scroll="{x: '120%'}"
                     size="small"
                     :data-source="leaveList.list"
                     :columns="leaveColumn"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{column, text, record}">
                    <template v-if="column.dataIndex === 'statusStr'">
                        <a-tag :color="businessStatusTagColor(record['status'])">{{ record['statusStr'] }}</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button type="link" size="small"
                                  v-if="isEditor(record['status'])"
                                  @click="handleLeaveFormModalVisible('editor', record['id'])">编辑</a-button>
                        <a-button type="link" size="small"
                                  v-if="isApply(record['status'])"
                                  @click="handleSubmitApplyModalVisible(record)">
                            {{ isApplyType(record.status) }}</a-button>
                        <a-button type="link" size="small"
                                  v-if="isDetails(record['status'])"
                                  @click="handleLeaveFormModalVisible('details', record['id'])">详情</a-button>
                        <a-button type="link" size="small"
                                  v-if="isApprovalHistory(record['status'])"
                                  @click="handleApprovalHistoryModalVisible(record)">审批历史</a-button>
                        <a-button type="link" size="small" danger
                                  v-if="isCancel(record['status'])"
                                  @click="handleCancelNotice(record)">撤回</a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="leaveList.total"
                          show-size-changer
                          simple/>
        </div>
    </div>

    <div>
        <a-modal class="modal"
                 width="800px"
                 style="top: 20px"
                 :closable="true"
                 :footer="null"
                 :open="leaveFormModalVisible"
                 @cancel="handleCancelLeaveFormModal">
            <leave-form :business-key="businessKey"
                        :operate="operate"
                        :opposite-end="true"
                        @update:visible="leaveFormModalVisible = $event"></leave-form>
        </a-modal>
    </div>

    <submit-apply-modal :visible="submitApplyModalVisible"
                        :leave="leave"
                        @update:visible="submitApplyModalVisible = $event"></submit-apply-modal>

    <cancel-apply-modal :visible="cancelApplyModalVisible"
                        :business-key="businessKey"
                        :process-instance-id="processInstanceId"
                        @update:visible="cancelApplyModalVisible = $event"></cancel-apply-modal>

    <approval-history :visible="approvalHistoryModalVisible"
                      :business-key="businessKey"
                      :process-instance-id="processInstanceId"
                      @update:visible="approvalHistoryModalVisible = $event"></approval-history>
</template>

<script setup>
import {h, reactive, ref, watch} from "vue"
import {getLeaveList} from "@/api/index.js"
import {notification, Button} from 'ant-design-vue'
import {PlusOutlined} from '@ant-design/icons-vue'
import {LeaveForm, SubmitApplyModal, CancelApplyModal, ApprovalHistory} from '@/components/index.js'
import {leaveColumn, businessStatusType} from '@/data/index.js'

const businessStatusTypeOptions = reactive(businessStatusType)
const leaveFormModalVisible = ref(false)
const submitApplyModalVisible = ref(false)
const cancelApplyModalVisible = ref(false)
const approvalHistoryModalVisible = ref(false)
const leaveList = reactive({
    total: 0,
    list: []
})
const queryFormInfo = reactive({
    title: '',
    status: null,
    current: 1,
    size: 5
})
// current
const leave = reactive({})
const businessKey = ref('')
const processInstanceId = ref('')
const operate = ref('')

// 判断业务状态标签颜色
const businessStatusTagColor = status => {
    if (status === 0) return 'pink'
    else if (status === 1) return 'blue'
    else if (status === 2) return 'orange'
    else if (status === 3) return 'green'
    else if (status === 4 || 5) return 'red'
}

// 判断是否显示操作按钮
const isApply = status => status === 0 || status === 1
const isEditor = status => status === 0 || status === 1
const isDetails = status => status === 2 || status === 3 || status === 5
const isApprovalHistory = status => status === 2  || status === 4
const isCancel = status => status === 2
const isApplyType = status => status === 0 ? '重新申请' : '提交申请'

const resetFormInfo = () => {
    queryFormInfo.title = ''
    queryFormInfo.status = null
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetLeaveList()
}

const resetCurrent = () => {
    leave.value = {}
    businessKey.value = ''
    processInstanceId.value = ''
    operate.value = ''
}

const handleGetLeaveList = async () => {
    leaveList.total = 0
    leaveList.list.splice(0, leaveList.list.length)
    const {code, result} = await getLeaveList(queryFormInfo)
    if (code === 20000) {
        leaveList.total = result.total
        result['records'].forEach(item => {
            item['index'] = `${result['records'].indexOf(item) + 1}`
            leaveList.list.push(item)
        })
    }
}

const handleCancelLeaveFormModal = () => {
    leaveFormModalVisible.value = false
}

// 新增请求、编辑请求、请求详情
const handleLeaveFormModalVisible = (operateVal, businessKeyVal) => {
    businessKey.value = businessKeyVal
    operate.value = operateVal
    leaveFormModalVisible.value = true
}

// 重新申请、提交申请
const handleSubmitApplyModalVisible = (record) => {
    leave.value = record
    submitApplyModalVisible.value = true
}

// 撤回已提交的申请
const handleCancelApplyModalVisible = (record) => {
    businessKey.value = record['id']
    processInstanceId.value = record['processInstanceId']
    notification.close(businessKey.value)
    cancelApplyModalVisible.value = true
}

const handleCancelNotice = (record) => {
    console.log(record)
    const id = record['id']
    const name = record['username']
    const leaveType = record['leaveTypeStr']
    notification.open({
        message: `是否撤回 [${name}] 的 [${leaveType}] 请假请求`,
        btn: () => h(Button,
            {
                type: 'primary',
                danger: true,
                size: 'small',
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleCancelApplyModalVisible(record)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

// 审批历史
const handleApprovalHistoryModalVisible = (record) => {
    businessKey.value = record['id']
    processInstanceId.value = record['processInstanceId']
    approvalHistoryModalVisible.value = true
}

handleGetLeaveList()

watch(() => [leaveFormModalVisible.value,
    submitApplyModalVisible.value,
    cancelApplyModalVisible.value,
    approvalHistoryModalVisible.value], value => {
    if (value.every(item => item === false)) {
        resetCurrent()
        handleGetLeaveList()
    }
})
</script>

<style scoped lang="less">
.ant-input,
.ant-select {
    width: 200px;
}
</style>
