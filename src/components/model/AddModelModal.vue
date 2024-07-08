<template>
    <a-modal class="modal"
             width="450px"
             :open="visible"
             ok-text="提交"
             cancel-text="取消"
             @ok="handleOk"
             @cancel="handleCancel">
        <h1>新增空白流程模型</h1>
        <div>
            <a-form :model="formInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-item label="模型名称" :colon="false" labelAlign="left">
                    <a-input placeholder="输入模型名称"
                             autocomplete="off"
                             showCount
                             :maxlength="15"
                             v-model:value="formInfo.name"/>
                </a-form-item>
                <a-form-item label="模型标识" :colon="false" labelAlign="left">
                    <a-input placeholder="输入模型标识"
                             autocomplete="off"
                             showCount
                             :maxlength="30"
                             v-model:value="formInfo.key"/>
                </a-form-item>
                <a-form-item label="备注" :colon="false" labelAlign="left">
                    <a-input placeholder="输入备注"
                             autocomplete="off"
                             showCount
                             :maxlength="20"
                             v-model:value="formInfo.description"/>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>

</template>

<script setup>
import {reactive, watch} from 'vue'
import {addModel} from '@/api/index.js'
import {message} from 'ant-design-vue'

const labelCol = {
    style: {width: '120px'}
}
const wrapperCol = {span: 30}

const props = defineProps({
    visible: Boolean
})
const emit = defineEmits(['update:visible'])

const formInfo = reactive({
    name: '',
    key: '',
    description: ''
})

const resetFormInfo = () => {
    formInfo.name = ''
    formInfo.key = ''
    formInfo.description = ''
}

const handleOk = async () => {
    const {code, information} = await addModel(formInfo)
    if (code === 20000) message.success(information)
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('update:visible', false)
}

watch(() => props.visible, value => {
    if (!value) resetFormInfo()
})
</script>

<style scoped lang="less">

</style>
