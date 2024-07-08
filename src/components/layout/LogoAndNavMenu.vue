<template>
	<nav>
		<div class="logo" ref="logo">
			<a href="/">
				<img src="../../assets/img/model.png" alt="model">
				<h1 v-if="!navState.collapsed">OA Workflow</h1>
			</a>
		</div>
		<a-config-provider
			:theme="{
      			token: {
        			colorPrimary: '#7a69a4',
      			},
    		}"
		>
			<a-menu
					:class="{ menu: true,
					fixed: navState.isFixed,
					relative: !navState.isFixed,
					width180: !navState.collapsed}"
					v-model:openKeys="navState.openKeys"
					v-model:selectedKeys="navState.selectedKeys"
					mode="inline"
					v-model:inline-collapsed="navState.collapsed"
					theme="dark"
					@openChange="onOpenChange"
			>
			<span class="collapsed iconfont"
				  @click="toggleCollapsed">{{ navState.collapsed === false ? '&#xe641;' : '&#xe640;' }}</span>
				<a-sub-menu key="sub1" @titleClick="titleClick">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>权限管理</template>
					<a-menu-item key="1">员工管理</a-menu-item>
					<a-menu-item key="2">权限管理</a-menu-item>
				</a-sub-menu>
				<a-sub-menu key="sub2">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>工作流程</template>
					<a-menu-item key="3">
						<router-link to="/workflow/model"><span>模型管理</span></router-link>
					</a-menu-item>
					<a-menu-item key="4">
						<router-link to="/workflow/definition"><span>流程定义管理</span></router-link>
					</a-menu-item>
					<a-menu-item key="5">
						<router-link to="/workflow/running"><span>运行中流程实例</span></router-link>
					</a-menu-item>
					<a-menu-item key="6">
						<router-link to="/workflow/finish"><span>已结束流程实例</span></router-link>
					</a-menu-item>
				</a-sub-menu>
				<a-sub-menu key="sub3">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>个人任务</template>
					<a-menu-item key="7">
						<router-link to="/task/await"><span>待办任务</span></router-link>
					</a-menu-item>
					<a-menu-item key="8">
						<router-link to="/task/complete"><span>已完成任务</span></router-link>
					</a-menu-item>
				</a-sub-menu>
				<a-sub-menu key="sub4">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>业务办理</template>
					<a-menu-item key="9">
						<router-link to="/apply/leave"><span>请假业务</span></router-link>
					</a-menu-item>
					<a-menu-item key="10">
						<router-link to="/apply/loan"><span>借款业务</span></router-link>
					</a-menu-item>
					<a-menu-item key="11">报销业务</a-menu-item>
				</a-sub-menu>
				<a-sub-menu key="sub5">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>通知管理</template>
					<a-menu-item key="12">通知列表</a-menu-item>
					<a-menu-item key="13">公告</a-menu-item>
				</a-sub-menu>
				<a-sub-menu key="sub6">
					<template #icon>
						<SettingOutlined/>
					</template>
					<template #title>文件管理</template>
				</a-sub-menu>
			</a-menu>
		</a-config-provider>

	</nav>
</template>

<script setup>
import {reactive, ref, onBeforeUnmount, onMounted} from 'vue'
import {AppstoreOutlined, MailOutlined, SettingOutlined} from '@ant-design/icons-vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const logo = ref(null)
const rootOpenKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6']
let navState = reactive({
    isFixed: false,
    headerHeight: 0,
    selectedKeys: ['1'],
    openKeys: ['sub1'],
    collapsed: false,
})

const currentOpenKey = () => {
    navState.openKeys = [rootOpenKeys[route.meta.open]]
    // console.log(route.meta)//
    navState.selectedKeys = [route.meta.selected]
}

const onOpenChange = keys => {
    if (keys.length === 0)
        navState.openKeys = [];
    else {
        const latestOpenKey = keys[keys.length - 1];
        if (latestOpenKey.startsWith('sub'))
            navState.openKeys = [latestOpenKey];
        else
            navState.openKeys = [latestOpenKey.substring(0, latestOpenKey.lastIndexOf('-'))];
    }
}

const toggleCollapsed = () => {
    navState.collapsed = !navState.collapsed
}

const titleClick = e => {
    console.log('titleClick', e);
}

const scrollHandler = () => {
    // 获取当前滚动的距离
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 判断当前滚动位置是否已经到达头部盒子的底部
    navState.isFixed = scrollTop >= navState.headerHeight;
}

// 根据当前路由触发对应菜单
currentOpenKey()

// Life cycle
onMounted(() => {
    navState.headerHeight = logo.value.getBoundingClientRect().height
    window.addEventListener("scroll", scrollHandler)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", scrollHandler)
})


</script>

<style scoped lang="less">
nav {
    height: 750px;
    background-color: #001529;
}

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55px;
    background-color: #001529;

    a {
        display: flex;
        width: 30px;
        height: 30px;
        color: white;
        font-size: 12px;
        justify-content: center;
        align-items: center;
        img {
            width: 100%;
        }
        h1 {
            margin-left: 10px;
            flex: 1;
            width: 100px;
            font-size: 16px;
            white-space: nowrap;
            font-weight: 500;
            letter-spacing: -0.5px;
        }
    }
}

.menu {
    margin-top: 20px;
    box-sizing: content-box;
    border: 0 !important;
    font-family: "微软雅黑 Light";

    .collapsed {
        z-index: 999;
        box-sizing: content-box;
        position: absolute;
        bottom: 50%;
        right: -14px;
        transform: translateY(50%);
        display: block;
        width: 27px;
        height: 27px;
        border: 1px solid #f0f0f0;
        border-radius: 50%;
        background-color: #ffffff;
        text-align: center;
        line-height: 27px;
        font-size: 20px;
        font-weight: 500;
        color: black;
        font-family: 'iconfont';
    }
}

.fixed {
    position: sticky;
    top: 0;
}

.relative {
    position: relative;
}

.width180 {
    width: 180px;
    padding: 20px 0;
}
</style>
