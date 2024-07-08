<template>
    <a-modal
        width="460px"
        :open="visible"
        ok-text="提交"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel">
        <h1>撤回请求</h1>
        <div class="content-box">
            <description>说明：请输入撤回的理由</description>
            <a-textarea style="height: 100px;"
                        autocomplete="off"
                        :maxlength="50"
                        :auto-size="{minRows: 3, maxRows: 3}"
                        v-model:value="reason"/>
        </div>
    </a-modal>
</template>

<script setup>
import {ref, reactive} from 'vue'
import {cancelProcessInstance} from '../../api/index.js'
import {message} from 'ant-design-vue'
import {Description} from '../index.js'

const props = defineProps({
    visible: Boolean,
    businessKey: String,
    processInstanceId: String
})
const emit = defineEmits(['update:visible'])
const reason = ref('')


const handleOk = async () => {
    const reasonVal = reason.value.trim()
    if (reasonVal.length === 0 || reasonVal === '') return message.error('撤回理由不能为空', 5)
    const businessKey = props.businessKey
    const processInstanceId = props.processInstanceId
    console.log(processInstanceId)
    const {code, information} =
        await cancelProcessInstance(businessKey, processInstanceId, reasonVal)
    if (code === 20000) message.success(information)

    reason.value = ''
    emit('update:visible', false)
}

const handleCancel = () => {
    reason.value = ''
    emit('update:visible', false)
}
</script>

<style scoped lang="less">
.content-box {
    margin: 30px 0;
}

</style>