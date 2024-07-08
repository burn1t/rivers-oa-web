<template>
    <div id="container">
        <div>
            <a-form layout="inline" :colon="false"
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
                    <a-button class="space15" type="primary" @click="handleGetModelList">查询</a-button>
                    <a-button @click="resetFormInfo">重置</a-button>
                </a-form-item>
            </a-form>
        </div>

                <div>
                    <a-button type="primary" @click="handleAddModalVisible">
                        <PlusOutlined/>
                        新增流程模型
                    </a-button>
                </div>

        <!--        <div>-->
        <!--            <a-table rowClassName="table-row-style"-->
        <!--                     size="small"-->
        <!--                     :data-source="modelList.list"-->
        <!--                     :columns="modelColumn"-->
        <!--                     :pagination="false"-->
        <!--                     table-layout="fixed">-->
        <!--                <template #bodyCell="{ column, text, record }">-->
        <!--                    <template v-if="column.dataIndex === 'operation'">-->
        <!--                        <a-button size="small" type="link"-->
        <!--                                  @click="handleDesignModalVisible(record.id)">设计流程-->
        <!--                        </a-button>-->
        <!--                        <a-button size="small" type="link"-->
        <!--                                  @click="handleDeployNotice(record)">部署流程-->
        <!--                        </a-button>-->
        <!--                        <a-button size="small" type="link"-->
        <!--                                  @click="handleExportModelZip(record.id)">导出 ZIP-->
        <!--                        </a-button>-->
        <!--                        <a-button size="small" type="link" danger-->
        <!--                                  @click="handleDeleteNotice(record)">删除-->
        <!--                        </a-button>-->
        <!--                    </template>-->
        <!--                </template>-->
        <!--            </a-table>-->
        <!--            <a-pagination-->
        <!--                v-model:current="queryFormInfo.current"-->
        <!--                v-model:pageSize="queryFormInfo.size"-->
        <!--                :total="modelList.total"-->
        <!--                show-size-changer-->
        <!--                simple/>-->
        <!--        </div>-->
    </div>


<!--    <add-model-modal :visible="addModalVisible"-->
<!--                     @update:visible="addModalVisible = $event"></add-model-modal>-->
<!--    -->
<!--    <design-model-modal :visible="designModalVisible"-->
<!--                        :model-id="modelId"-->
<!--                        @update:visible="designModalVisible = $event"></design-model-modal>-->
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

const handleAddModalVisible = () => {
    addModalVisible.value = true
}

handleGetModelList()


</script>

<style scoped lang="less">
.ant-input {
    width: 200px;
}
</style>