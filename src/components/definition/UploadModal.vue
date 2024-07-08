<template>

    <a-modal width="500px"
             class="modal"
             :open="visible"
             @cancel="handleCancel">
        <template #footer></template>
        <h1>部署流程文件</h1>

        <a-upload-dragger name="file"
                          method="post"
                          action="http://localhost:9090/api/v1.0/workflow/definition/deploy/file"
                          :multiple="true"
                          :headers="header"
                          v-model:fileList="fileList"
                          :beforeUpload="handleBeforeUpload"
                          @change="handleChange">
            <span class="iconfont icon-upload"></span>
            <div class="information">
                <p class="upload-text">点击上传 BPMN 流程文件</p>
                <p>仅支持 .zip、.bpmn20.xml、bpmn 格式文件</p>
            </div>
        </a-upload-dragger>
    </a-modal>
</template>

<script setup>
import {ref} from 'vue'
import {getToken} from '@/utils/auth.js'
import {message} from 'ant-design-vue'

const props = defineProps({
    visible: Boolean,
})
const emit = defineEmits(['update:visible'])

let fileList = ref([])
let header = ref({token: getToken()})

const handleCancel = () => {
    emit('update:visible', false)
}

const handleBeforeUpload = (file, fileList)=> {
    if (fileList.length > 1) {
        file.status = 'error'
        message.error('仅支持上传一个文件')
        reject(false)
    }
    const extList = ['text/xml', 'application/x-zip-compressed']
    const fileType = file.type
    if (!extList.find(item => item === fileType)) {
        file.status = 'error'
        message.error(`${file.name} 不是支持的文件格式`)
        reject(false)
    }
    return true
}

const handleChange = info => {
    const status = info.file.status
    if (status !== 'uploading') console.log(info.file, info.fileList)
    if (status === 'done')
        message.success(`流程文件 ${info.file.name} 部署成功`)
    else if (status === 'error')
        message.error(`流程文件 ${info.file.name} 部署失败`)
}
</script>

<style scoped lang="less">
.icon-upload {
    font-size: 26px;
}

.information {
    margin-top: 20px;

    p {
        font-size: 13px;
    }

    .upload-text {
        color: #198fef;
    }
}
</style>
