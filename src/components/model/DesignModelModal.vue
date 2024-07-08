<template>
	<a-modal wrap-class-name="full-modal"
			 width="100%"
             hight="100%"
			 :open="visible"
			 :footer="null"
			 @cancel="handleCancel">
		<h1>Activiti 工作流在线流程设计器</h1>
		<div>
			<iframe class="iframe" :src="src"></iframe>
		</div>
	</a-modal>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
    visible: Boolean,
	modelId: String
})

const emit = defineEmits(['update:visible'])

const src = computed(() => {
    console.log(props.modelId)
    return '/modeler.html?modelId=' + props.modelId
})

const handleCancel = () =>{
    emit('update:visible', false)
}
</script>

<style scoped lang="less">
.iframe {
    width: 100%;
    height: calc(100vh - 130px);
	margin-top: 20px;
    border: 0;
}
</style>
