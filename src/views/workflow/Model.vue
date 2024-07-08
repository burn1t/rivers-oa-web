<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
                    :label-col="{style: { marginRight: '5px'}}"
                    :model="queryFormInfo">
                <a-form-item label="模型名称" labelAlign="left">
                    <a-input placeholder="输入模型名称"
                             autocomplete="off"
                             v-model:value="queryFormInfo.name"/>
                </a-form-item>
                <a-form-item label="模型标识" labelAlign="left">
                    <a-input placeholder="输入模型标识"
                             @click.prevent
                             v-model:value="queryFormInfo.key"/>
                </a-form-item>
                <a-form-item>
                    <a-space :size="15">
                        <a-button type="primary" @click="handleGetModelList">查询</a-button>
                        <a-button @click="resetFormInfo">重置</a-button>
                    </a-space>
                </a-form-item>
            </a-form>
        </div>

        <div>
            <a-button type="primary" @click="handleAddModalVisible">
                <PlusOutlined/>
                新增流程模型
            </a-button>
        </div>

        <div>
            <a-table rowClassName="table-row-style"
                     size="small"
                     :data-source="modelList.list"
                     :columns="modelColumn"
                     :pagination="false"
                     table-layout="fixed">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'operation'">
                        <a-button size="small" type="link"
                                  @click="handleDesignModalVisible(record.id)">设计流程</a-button>
                        <a-button size="small" type="link"
                                  @click="handleDeployNotice(record)">部署流程</a-button>
                        <a-button size="small" type="link"
                                  @click="handleExportModelZip(record.id)">导出 ZIP</a-button>
                        <a-button size="small" type="link" danger
                                  @click="handleDeleteNotice(record)">删除</a-button>
                    </template>
                </template>
            </a-table>
            <a-pagination
                v-model:current="queryFormInfo.current"
                v-model:pageSize="queryFormInfo.size"
                :total="modelList.total"
                show-size-changer
                simple/>
        </div>
    </div>

    <add-model-modal :visible="addModalVisible"
                     @update:visible="addModalVisible = $event"></add-model-modal>

    <design-model-modal :visible="designModalVisible"
                        :model-id="modelId"
                        @update:visible="designModalVisible = $event"></design-model-modal>
</template>

<script setup>
import {ref, reactive, watch, h} from 'vue'
import {getModel, deployModel, deleteModel, exportModelZip} from '@/api'
import {notification, message, Button} from 'ant-design-vue'
import {PlusOutlined} from '@ant-design/icons-vue'
import {AddModelModal, DesignModelModal} from '@/components'
import {modelColumn} from '@/data'

const addModalVisible = ref(false)
const designModalVisible = ref(false)
const modelList = reactive({
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
const modelId = ref('')

const resetFormInfo = () => {
    queryFormInfo.name = ''
    queryFormInfo.key = ''
    queryFormInfo.current = 1
    queryFormInfo.size = 5
    handleGetModelList()
}

const handleGetModelList = async () => {
    modelList.total = 0
    modelList.list.splice(0, modelList.list.length)
    try {
        const {code, result} = await getModel(queryFormInfo)
        if (code === 20000) {
            modelList.total = result.total
            result['records'].forEach(item => {
                item['index'] = `${result['records'].indexOf(item) + 1}`
                modelList.list.push(item)
            })
        }
    } catch (e) {
        console.log(e)
    }
}

const resetCurrent = () => {
    modelId.value = ''
}

const handleAddModalVisible = () => {
    addModalVisible.value = true
}

const handleDesignModalVisible = (id) => {
    modelId.value = id
    designModalVisible.value = true
}

// 部署流程
const handleDeployModel = async (id) => {
    const {code, information} = await deployModel(id)
    if (code === 20000) message.success(information)
    notification.close(id)
}

const handleDeployNotice = (record) => {
    const id = record.id
    const name = record.name
    notification.open({
        message: `是否部署模型 [${name}]`,
        btn: () => h(Button,
            {
                type: 'primary',
                size: 'small',
                style: {
                    top: '0',
                    right: '0'
                },
                onClick: () => handleDeployModel(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

// 导出模型 ZIP
const handleExportModelZip = async (modelId) => {
    const response = await exportModelZip(modelId)
    const blob = new Blob([response['data']], {
        type: 'application/octet-stream'
    })
    const url = window.URL.createObjectURL(blob)
    const fileName = response['headers']['content-disposition'].split(';')[1].split("=")[1]

    const a = document.createElement('a')
    a.href = url
    a.download = decodeURI(fileName)
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()

    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}

// 删除模型
const handleDeleteModel = async (id) => {
    const {code, information} = await deleteModel(id)
    if (code === 20000) message.success(information)
    notification.close(id)
    await handleGetModelList()
}

const handleDeleteNotice = (record) => {
    const id = record.id
    const name = record.name
    notification.open({
        message: `是否删除模型 [${name}]`,
        class: 'delete-notification',
        btn: () => h(Button,
            {
                type: 'primary',
                danger: true,
                size: 'small',
                onClick: () => handleDeleteModel(id)
            }, {
                default: () => '确定',
            }),
        key: id,
    })
}

handleGetModelList()

watch(() => [addModalVisible.value, designModalVisible.value], value => {
    if (value.every(item => item === false)) {
        resetCurrent()
        handleGetModelList()
    }
})
</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>
