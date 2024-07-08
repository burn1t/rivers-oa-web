<template>
	<a-modal
			 width="450px"
			 :open="visible"
			 ok-text="提交"
			 cancel-text="取消"
			 @ok="handleOk"
			 @cancel="handleCancel">
		<h1>流程配置</h1>
		<div>
			<a-form :model="formInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
				<a-form-item label="关联业务路由名" :colon="false" labelAlign="left">
					<a-input  placeholder="输入关联业务路由名"
                              autocomplete="off"
                              showCount
                              :maxlength="15"
                              v-model:value="formInfo.businessRoute"/>
				</a-form-item>
				<a-form-item label="关联表单组件名" :colon="false" labelAlign="left">
					<a-input placeholder="输入关联表单组件名"
                             autocomplete="off"
                             showCount
                             :maxlength="20"
                             v-model:value="formInfo.formName"/>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
</template>

<script setup>
import {reactive, watch} from 'vue'
import {getProcessConfig, saveOrUpdateProcessConfig} from '@/api/index.js'
import {message} from 'ant-design-vue'

// table style
const labelCol = {
    style: { width: '130px' }
}
const wrapperCol = { span: 20 }


const props = defineProps({
    visible: Boolean,
    processKey: String
})
const emit = defineEmits(['update:visible'])

const formInfo = reactive({
    businessRoute: '',
    formName: ''
})

const resetFormInfo = () => {
    formInfo.businessRoute = ''
    formInfo.formName = ''
}

const handleOk = async () => {
    let processKey = props.processKey
    const {code, information} = await saveOrUpdateProcessConfig({processKey, ...formInfo})
    if (code === 20000) message.success(information)
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('update:visible', false)
}

const getProcessConfigInfo = async () => {
	const processKey = props.processKey
    const {result} = await getProcessConfig(processKey)
	if (result === null) return
	formInfo.businessRoute = result.businessRoute
	formInfo.formName = result.formName
}

// 监听
watch(() => props.visible, value => {
    if (value) getProcessConfigInfo()
    else  resetFormInfo()
})
</script>

<style scoped lang="less">
.form {
    font-family: "微软雅黑 Light", serif;
    .item {
        position: relative;
        margin-top: 30px;
        label {
            display: inline-block;
            margin-top: 3px;
            font-size: 16px;
            font-family: "微软雅黑 Light", serif;
        }
        .input {
            position: absolute;
            right: 0;
            width: 68%;
        }
        &:last-child {
            margin-bottom: 40px;
        }
    }
}
</style>
