<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
                    :label-col="{style: { marginRight: '5px'}}"
                    :model="queryFormInfo">
                <a-form-item label="流程名称" labelAlign="left">
                    <a-input placeholder="请输入流程名称"
                             autocomplete="off"
                             v-model:value="queryFormInfo.name"/>
                </a-form-item>
                <a-form-item label="流程标识" labelAlign="left">
                    <a-input placeholder="输入模型标识"
                             @click.prevent
                             v-model:value="queryFormInfo.key"/>
                </a-form-item>
                <a-form-item>
                    <a-space :size="15">
                        <a-button type="primary" @click="handleGetDefinitionList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-button type="primary" @click="handleUploadModal">
                <cloud-upload-outlined/>
                部署流程文件
            </a-button>
        </div>

        <description>说明：存在多个相同标识的流程，只显示其最新版本</description>

        <div>
            <a-table rowClassName="table-row-style"
                     :scroll="{ x: '135%' }"
                     :data-source="definitionList.list"
                     :columns="definitionColumn"
                     size="small"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'state'">
                        <a-tag :color="processStatusTagColor(record['state'])">
                            {{ processStatusTagStr(record['state']) }}
                        </a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'xmlName'">
                        <a-button type="link"
                                  @click="exportDefinitionXmlOrPng('xml', record['id'])">{{ record['xmlName'] }}
                        </a-button>
                    </template>
                    <template v-if="column.dataIndex === 'pngName'">
                        <a-button type="link"
                                  @click="handlePreviewImgModal(record['id'])">{{ record['pngName'] }}</a-button>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a-space :size="15">
                            <a-button class="physical-button"
                                      type="primary"
                                      size="small"
                                      @click="handleProcessConfigModal(record['key'])">流程配置</a-button>
                            <a-button class="physical-button" type="primary" size="small"
                                      @click="handleUpdateStateNotice(record)">
                                {{record.state ? '激活' : '挂起'}}</a-button>
                            <a-button class="physical-button"
                                      size="small"
                                      danger
                                      @click="handleDeleteNotice(record)">删除</a-button>
                        </a-space>
                    </template>
                </template>
            </a-table>
            <a-pagination class="pagination"
                          v-model:current="queryFormInfo.current"
                          v-model:pageSize="queryFormInfo.size"
                          :total="definitionList.total"
                          show-size-changer
                          simple/>
        </div>
    </div>

    <process-config-modal :visible="configModalVisible"
                          :process-key="processKey"
                          @update:visible="configModalVisible = $event"/>
    <preview-img-modal :visible="previewImgModalVisible"
                       :id="processDefinitionId"
                       @update:visible="previewImgModalVisible = $event"/>
    <upload-modal :visible="uploadModalVisible"
                  @update:visible="uploadModalVisible = $event"/>
</template>

<script setup>
import {ref, reactive, watch, h} from 'vue'
import {getDefinition, updateDefinitionState, deleteDefinition, exportDefinitionXmlOrPng} from '@/api/index.js'
import {notification, message, Button} from 'ant-design-vue'
import {CloudUploadOutlined} from '@ant-design/icons-vue'
import {Description, ProcessConfigModal, PreviewImgModal, UploadModal} from '@/components/index.js'
import {definitionColumn} from '@/data/index.js'

const configModalVisible = ref(false)
const previewImgModalVisible = ref(false)
const uploadModalVisible = ref(false)
const definitionList = reactive({
    total: 0,
    list: []
})
const queryFormInfo = reactive({
    name: '',
    key: '',
    current: 1,
    size: 5
})
// current
const processKey = ref('')
const processDefinitionId = ref('')

const processStatusTagColor = status => {
    if (status) return 'orange'
    else return 'green'
}

const processStatusTagStr = status => {
    if (status) return '已挂起'
    else return '已激活'
}

const handleGetDefinitionList = async () => {
    definitionList.total = 0
    definitionList.list.splice(0, definitionList.list.length)
    try {
        const {code, result} = await getDefinition(queryFormInfo)
        if (code === 20000) {
            definitionList.total = result.total
            result['records'].forEach(item => {
                item['index'] = `${result['records'].indexOf(item) + 1}`
                definitionList.list.push(item)
            })
        }
    } catch (e) {
        console.log(e)
    }
}

const resetFormInfo = () => {
    queryFormInfo.name = ''
    queryFormInfo.key = ''
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetDefinitionList()
}

const resetCurrent = () => {
    processKey.value = ''
    processDefinitionId.value = ''
}

const handleProcessConfigModal = (key) => {
    processKey.value = key
    configModalVisible.value = true
}

// 挂起或激活流程定义
const handleUpdateState = async (id) => {
    const {code, information} = await updateDefinitionState(id)
    if (code === 20000) message.success(information)
    notification.close(id)
    await handleGetDefinitionList()
}

const handleUpdateStateNotice = (record) => {
    const id = record['id']
    const name = record['name']
    const key = record['key']
    const state = record['state']
    const message = state ? '激活' : '挂起'
    const description = state
        ? '注意：激活后，该流程定义下的所有任务将继续运行' : '注意：挂起后，该流程定义下的所有任务将不再运行'
    notification.open({
        message: `是否${message}流程定义 [${name}-${key}]`,
        description: description,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleUpdateState(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })

}

// 删除流程定义
const handleDeleteNotice = (record) => {
    const deploymentId = record['deploymentId']
    const name = record['name']
    const key = record['key']
    const version = record['version']
    notification.open({
        message: `是否删除流程定义  [${name}-${key}-v${version}]`,
        style: {
            width: '430px',
        },
        class: 'delete-notification',
        btn: () => h(Button,
            {
                type: 'primary',
                danger: true,
                size: 'small',
                onClick: () => handleDelete(deploymentId, key)
            }, {
                default: () => '确定',
            }),
        key: deploymentId,
    })
}

const handleDelete = async (deploymentId, processKey) => {
    const {code, information} = await deleteDefinition(deploymentId, processKey)
    if (code === 20000) message.success(information)
    notification.close(deploymentId)
    await handleGetDefinitionList()
}


const handlePreviewImgModal = (id) => {
    processDefinitionId.value = id
    previewImgModalVisible.value = true
}

const handleUploadModal = () => {
    uploadModalVisible.value = true
}

handleGetDefinitionList()

// 监听
watch(() => [configModalVisible.value,
    previewImgModalVisible.value,
    uploadModalVisible.value], value => {
    if (value.every(item => item === false)) {
        resetCurrent()
        handleGetDefinitionList()
    }
})
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>