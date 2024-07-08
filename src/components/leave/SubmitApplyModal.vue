<template>
    <a-modal
        width="460px"
        :open="visible"
        ok-text="提交"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel">
        <h1>提交请求</h1>
        <div class="content-box">
            <description>说明：可选择多个用户</description>
            <form>
                <label for="username">审批人姓名</label>
                <a-select style="width: 100%"
                          mode="multiple"
                          placeholder="选择审批人"
                          :max-tag-text-length="10"
                          :options="options"
                          v-model:value="assignees"
                ></a-select>
            </form>
        </div>
    </a-modal>
</template>

<script setup>
import {reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import {startupProcessInstance} from '@/api/index.js'
import {message} from 'ant-design-vue'
import {Description} from '@/components'
import {candidateUser} from '@/data'

const route = useRoute()

const props = defineProps({
    visible: Boolean,
    leave: Object
})
const emit = defineEmits(['update:visible'])
const options = reactive(candidateUser)
const assignees = ref([])

const handleOk = async () => {
    const assigneesVal = assignees.value
    if (assigneesVal.length === 0) return message.error('审批人姓名不能为空', 5)
    const leaveInfo = props.leave.value
    const submitApplyData = {
        businessRoute: route.name,
        businessKey: leaveInfo.id,
        assignees: assignees.value,
        variables: {
            entity: leaveInfo
        }
    }
    const {code, information} = await startupProcessInstance(submitApplyData);
    if (code === 20000) console.log(information)
    assignees.value = []
    emit('update:visible', false)
}

const handleCancel = () => {
    assignees.value = []
    emit('update:visible', false)
}
</script>

<style scoped lang="less">
.content-box {
    margin: 30px 0;
}

form {
    display: flex;
    margin-top: 15px;

    label {
        width: 120px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
    }

    .special-select {
        flex: 1;
    }
}
</style>