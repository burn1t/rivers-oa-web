<template>
	<a-card class="container-breadcrumb" size="small" v-if="route.name !== 'welcome'">
		<a-breadcrumb class="breadcrumb">
			<a-breadcrumb-item><a href="/"><home-outlined/></a></a-breadcrumb-item>
			<a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
				<a v-if="index !== breadcrumbList.length-1" :href="item.meta.path">{{item.meta.title}}</a>
				<span v-else>{{item.meta.title}}</span>
			</a-breadcrumb-item>
		</a-breadcrumb>
	</a-card>
</template>

<script setup>
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {HomeOutlined} from '@ant-design/icons-vue'

const route = useRoute()

let breadcrumbList = ref([])

const getBreadcrumbList = () => {
    breadcrumbList.value = route.matched.filter(item =>
        item.meta && item.meta['title'] !== undefined
    )
}

getBreadcrumbList()

watch(route, (value, oldValue) => {
    getBreadcrumbList()
})


</script>

<style scoped lang="less">
.container-breadcrumb{
    //background-color: pink;
    margin-bottom: 10px;
    background-color: #fff;
    //padding: 20px 0;
    border-radius: 5px;
}
.container-breadcrumb,
.breadcrumb {
    font-family: "微软雅黑 Light", serif;
}
</style>
