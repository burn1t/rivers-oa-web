<template>
    <h1 v-if="oppositeEnd">{{ operateTitle }}</h1>
    <div>
        <a-form :model="formInfo"
                :label-col="{style: {width: '125px'}}"
                :wrapper-col="{span: 25}"
                :disabled="isDetails()">
            <a-form-item label="请假类型" :colon="false" labelAlign="left">
                <a-select placeholder="选择一个请假类型"
                          autocomplete="off"
                          :options="leaveTypeOptions"
                          v-model:value="formInfo.leaveType"/>
            </a-form-item>
            <a-form-item label="标题" :colon="false" labelAlign="left">
                <a-input placeholder="输入请假标题"
                         autocomplete="off"
                         showCount
                         :maxlength="20"
                         v-model:value="formInfo.title"/>
            </a-form-item>
            <a-form-item label="请假事由" :colon="false" labelAlign="left">
                <a-textarea placeholder="输入请假事由"
                            autocomplete="off"
                            showCount
                            :maxlength="300"
                            :auto-size="{minRows: 6, maxRows: 6}"
                            v-model:value="formInfo.leaveReason"/>
            </a-form-item>
            <a-form-item label="请假时间" :colon="false" labelAlign="left">
                <a-range-picker :locale="locale" v-model:value="formInfo.leaveDate"/>
            </a-form-item>
            <a-form-item label="请假天数" :colon="false" labelAlign="left">
                <a-input-number autocomplete="off"
                                disabled
                                v-model:value="formInfo.duration"/>
            </a-form-item>
            <a-form-item label="联系电话" :colon="false" labelAlign="left">
                <a-input autocomplete="off"
                         placeholder="选择联系电话"
                         showCount
                         :maxlength="11"
                         v-model:value="formInfo.contactPhone"/>
            </a-form-item>
            <a-form-item label="应急工作委托人" :colon="false" labelAlign="left">
                <a-input autocomplete="off"
                         placeholder="输入应急工作委托人姓名"
                         showCount
                         :maxlength="10"
                         v-model:value="formInfo.principal"/>
            </a-form-item>
            <a-form-item  :wrapper-col="{ span: 15, offset: 4 }" v-if="!isDetails()">
                <a-button :disabled="false" class="space15" type="primary" @click="handleSubmit">确定</a-button>
                <a-button @click="handleCancel">取消</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup>
import {reactive, ref, watch} from 'vue'
import moment from 'moment'
import dayjs from 'dayjs'
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN'
import {addLeave, getLeave, updateLeave} from '@/api'
import {message} from 'ant-design-vue'
import {leaveType, OperateEnum} from '@/data'

const props = defineProps({
    operate: String,
    businessKey: String,
    oppositeEnd: Boolean
})
const emit = defineEmits(['update:visible'])

const operateTitle = ref('')
const leaveTypeOptions = reactive(leaveType)
const formInfo = reactive({
    id: '',
    leaveType: null,
    title: '',
    leaveReason: '',
    startDate: '',
    endDate: '',
    duration: 0,
    contactPhone: '',
    principal: '',
    leaveDate: []
})

const isDetails = () => {
    return OperateEnum.DETAILS === props.operate
}

const resetFormInfo = () => {
    formInfo.id = ''
    formInfo.leaveType = null
    formInfo.title = ''
    formInfo.leaveReason = ''
    formInfo.startDate = ''
    formInfo.endDate = ''
    formInfo.duration = 0
    formInfo.contactPhone = ''
    formInfo.principal = ''
    formInfo.leaveDate = []
}

const handleGetLeaveByBusinessId = async () => {
    const {code, result} = await getLeave(props.businessKey)
    if (code === 20000) {
        formInfo.leaveType = result.leaveType
        formInfo.title = result.title
        formInfo.leaveReason = result.leaveReason
        if (result['startDateStr'] !== '')
            formInfo.leaveDate.push(dayjs(result['startDateStr']))
        if (result['endDateStr'] !== '')
            formInfo.leaveDate.push(dayjs(result['endDateStr']))
        formInfo.duration = result.duration
        formInfo.contactPhone = result.contactPhone
        formInfo.principal = result.principal
        // 格式化
        if (formInfo.leaveDate.length > 0) {
            let startTime = value[0]['$d']
            let endTime = value[1]['$d']
            formInfo.startDate = moment(startTime).format("YYYY-MM-DD")
            formInfo.endDate = moment(endTime).format("YYYY-MM-DD")
            formInfo.duration = moment(endTime).diff(startTime, 'day')
        }
    }
}

const handleAddLeave = async () => {
    const {code, information} = await addLeave(formInfo)
    if (code === 20000) message.success(information)

}

const handleEditorLeave = async () => {
    const {code, information} = await updateLeave(formInfo)
    if (code === 20000) message.success(information)
}

const handleSubmit = () => {
    if (props.operate === OperateEnum.ADD) handleAddLeave()
    if (props.operate === OperateEnum.EDITOR) handleEditorLeave()
    resetFormInfo()
    emit('update:visible', false)
}

const handleCancel = () => {
    resetFormInfo()
    emit('update:visible', false)
}

watch(() => props.businessKey, value => {
    console.log(props.operate)
    if (!value) operateTitle.value = ''
    if (OperateEnum.ADD === props.operate) operateTitle.value = '新增请求'
    else if (OperateEnum.EDITOR === props.operate) operateTitle.value = '编辑请求'
    else if (OperateEnum.DETAILS === props.operate) operateTitle.value = '请求详情'
}, {immediate: true})

// 根据 business id 获取对应请求请求详情
watch(() => props.businessKey, (value) => {
    if (value !== '') {
        formInfo.id = value
        handleGetLeaveByBusinessId()
    }
}, {immediate: true})

</script>

<style scoped lang="less">

</style>
