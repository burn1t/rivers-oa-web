<template>
    <nav :class="{width180: !navState.isCollapsed}">
        <div id="logo" ref="logo">
            <a href="/">
                <img src="@/assets/img/model.png" alt="model">
                <h1 v-if="!navState.isCollapsed">Rivers</h1>
            </a>
        </div>

        <a-config-provider :theme="{token: {colorPrimary: '#7a69a4'}}">
            <a-menu id="menu"
                    theme="dark"
                    mode="inline"
                    :class="{fixed: navState.isFixed,
					         relative: !navState.isFixed,
					         width180: !navState.isCollapsed}"
                    v-model:inline-collapsed="navState.isCollapsed"
                    v-model:openKeys="navState.openKeys"
                    v-model:selectedKeys="navState.selectedKeys"
                    @openChange="onOpenChange">
                <span class="collapsed" @click="toggleCollapsed">{{ navState.isCollapsed === false ? '◀' : '▶' }}</span>
                <!--				<a-sub-menu key="sub1" @titleClick="titleClick">-->
                <!--					<template #icon>-->
                <!--						<SettingOutlined/>-->
                <!--					</template>-->
                <!--					<template #title>权限管理</template>-->
                <!--					<a-menu-item key="1">员工管理</a-menu-item>-->
                <!--					<a-menu-item key="2">权限管理</a-menu-item>-->
                <!--				</a-sub-menu>-->
                <a-sub-menu key="sub2">
                    <template #icon>
                        <DatabaseOutlined/>
                    </template>
                    <template #title>流程管理</template>
                    <a-menu-item key="3">
                        <router-link to="/workflow/model"><span>流程定义模型</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="4">
                        <router-link to="/workflow/definition"><span>流程定义</span></router-link>
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
                        <FundProjectionScreenOutlined/>
                    </template>
                    <template #title>业务办理</template>
                    <a-menu-item key="7">
                        <router-link to="/apply/leave"><span>请假业务</span></router-link>
                    </a-menu-item>
                    <!--                    <a-menu-item key="8">-->
                    <!--                        <router-link to="/apply/loan"><span>借款业务</span></router-link>-->
                    <!--                    </a-menu-item>-->
                    <!--                    <a-menu-item key="9">报销业务</a-menu-item>-->
                </a-sub-menu>
                <a-sub-menu key="sub4">
                    <template #icon>
                        <ScheduleOutlined/>
                    </template>
                    <template #title>个人任务</template>
                    <a-menu-item key="10">
                        <router-link to="/task/await"><span>待审批任务</span></router-link>
                    </a-menu-item>
                    <a-menu-item key="11">
                        <router-link to="/task/complete"><span>已审批任务</span></router-link>
                    </a-menu-item>
                </a-sub-menu>
                <!--                <a-sub-menu key="sub5">-->
                <!--                    <template #icon>-->
                <!--                        <BellOutlined/>-->
                <!--                    </template>-->
                <!--                    <template #title>通知管理</template>-->
                <!--                    <a-menu-item key="12">通知列表</a-menu-item>-->
                <!--                    <a-menu-item key="13">公告</a-menu-item>-->
                <!--                </a-sub-menu>-->
                <!--                <a-sub-menu key="sub6">-->
                <!--                    <template #icon>-->
                <!--                        <FolderOpenOutlined/>-->
                <!--                    </template>-->
                <!--                    <template #title>文件管理</template>-->
                <!--                </a-sub-menu>-->
            </a-menu>
        </a-config-provider>
    </nav>
</template>

<script setup>
import {ref, reactive, watch, onBeforeUnmount, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {
    DatabaseOutlined,
    ScheduleOutlined,
    FundProjectionScreenOutlined,
    BellOutlined,
    FolderOpenOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const logo = ref(null)
const rootOpenKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6']
let navState = reactive({
    selectedKeys: [''],
    openKeys: [''],
    headerHeight: 0,
    isFixed: false,
    isCollapsed: false,
    fixDistance: 0
})

// 首次加载，根据当前路由触发对应菜单
const currentOpenKey = () => {
    navState.openKeys = [rootOpenKeys[route.meta['open']]]
    navState.selectedKeys = [route.meta['selected']]
}

const onOpenChange = keys => {
    if (keys.length === 0)
        navState.openKeys = []
    else {
        const latestOpenKey = keys[keys.length - 1]
        if (latestOpenKey.startsWith('sub'))
            navState.openKeys = [latestOpenKey]
        else
            navState.openKeys = [latestOpenKey.substring(0, latestOpenKey.lastIndexOf('-'))]
    }
}

const toggleCollapsed = () => {
    navState.isCollapsed = !navState.isCollapsed
}

currentOpenKey()

const scrollHandler = () => {
    // 获取当前滚动的距离
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // 判断当前滚动位置是否已经到达头部盒子的底部
    navState.isFixed = scrollTop >= navState.headerHeight
}

watch(() => router.currentRoute.value, () => currentOpenKey())

onMounted(() => {
    navState.headerHeight = logo.value.getBoundingClientRect().height
    window.addEventListener('scroll', scrollHandler)
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', scrollHandler)
})
</script>

<style scoped lang="less">
nav {
    //height: 100%;
    #logo {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 25px;
        height: 55px;
        background-color: #001529;

        a {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            color: white;

            h1 {
                width: 100px;
                margin-left: 16px;
                font-size: 15px;
                letter-spacing: 6px;
            }
        }
    }

    #menu {
        padding-top: 25px;
    }

    .collapsed {
        opacity: 0;
        z-index: 999;
        box-sizing: content-box;
        position: absolute;
        top: 80px;
        right: -8px;
        transform: translateY(50%);
        width: 12px;
        height: 50px;
        border: 2px solid #f4f4f4;
        border-radius: 30px;
        background-color: #ffffff;
        font-size: 10px;
        font-weight: 500;
        text-align: center;
        line-height: 50px;
        color: #8a8f8d;
        transition: opacity 0.3s ease-in 0s;

        &:hover {
            background: #eeefef;
            cursor: pointer;
        }
    }

    &:hover .collapsed {
        opacity: 1;
    }
}

.fixed {
    position: fixed;
    top: 0;
}

.relative {
    position: relative;
}

.width180 {
    width: 180px;
}
</style>
