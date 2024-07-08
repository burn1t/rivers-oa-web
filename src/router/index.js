import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import {getToken, removeToken} from '../utils/auth.js'
import loginRoute from './login_route.js'
import homeRoute from './home_route.js'
import workflowRoute from './workflow_route.js'
import applyRoute from './apply_route.js'
import taskRoute from './task_route.js'

const routes = [].concat(
    loginRoute,
    homeRoute,
    workflowRoute,
    applyRoute,
    taskRoute
)

const router = createRouter({
    history: createWebHashHistory(),
    // history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // 无 token 则登录
    if (to.fullPath === '/login') removeToken()
    if (to.meta['requireAuth']) {
        if (getToken())
            next()
        else
            next('/login')
    }
    else next()
})

export default router