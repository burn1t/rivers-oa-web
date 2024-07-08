<template>
    <a-modal width="900px"
             class="modal"
             :open="visible"
             ok-text="确定"
             cancel-text="取消"
             @ok="handleOk"
             @cancel="handleCancel">
        <h1>流程图展示</h1>
        <div class="img-container">
            <img :src="url" alt="img">
        </div>
        <description>说明：是否下载流程图</description>
    </a-modal>
</template>

<script setup>
import {ref, watch} from 'vue'
import {exportDefinitionXmlOrPng, getDefinitionImgBlob} from '@/api'
import {Description} from '@/components'

const props = defineProps({
    visible: Boolean,
    id: String
})
const emit = defineEmits(['update:visible'])

const url = ref('')

const handleOk = () => {
    exportDefinitionXmlOrPng('png', props.id)
    emit('update:visible', false)
}

const handleCancel = () => {
    emit('update:visible', false)
}

const getDefinitionImg = async () => {
    const response = await getDefinitionImgBlob(props.id)
    const blob = new Blob([response['data']], {
        type: 'application/octet-stream'
    })
    url.value = window.URL.createObjectURL(blob)
}

watch(() => props.visible, value => {
    if (value) getDefinitionImg()
    else url.value = ''
})
</script>

<style scoped lang="less">

</style>
