const index = () => import('../views/Index.vue')
const model = () => import('../views/workflow/Model.vue')
const definition = () => import('../views/workflow/Definition.vue')
const running = () => import('../views/workflow/Running.vue')
const finish = () => import('../views/workflow/Finish.vue')
const routes = [
    {
        path: '/workflow',
        redirect: '/workflow/model',
        component: index,
        meta: {
            title: '工作流程',
            open: 1,
            requireAuth: true  // 需要认证
        },
        children: [
            {
                path: 'model',
                name: 'model',
                component: model,
                meta: {
                    requireAuth: true,
                    title: '模型管理',
                    selected: '3'
                }
            },
            {
                path: 'definition',
                name: 'definition',
                component: definition,
                meta: {
                    requireAuth: true,
                    title: '流程定义管理',
                    selected: '4'
                }
            },
            {
                path: 'running',
                name: 'running',
                component: running,
                meta: {
                    requireAuth: true,
                    title: '运行中流程实例',
                    selected: '5'
                }
            },
            {
                path: 'finish',
                name: 'finish',
                component: finish,
                meta: {
                    requireAuth: true,
                    title: '已结束流程实例',
                    selected: '6'
                }
            }
        ]
    },
]

export default routes