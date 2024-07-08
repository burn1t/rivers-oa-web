const index = () => import('../views/Index.vue')
const await_ = () => import('../views/task/Await.vue')
const complete = () => import('../views/task/Completed.vue')
const route = [
    {
        path: '/task',
        redirect: '/task/await',
        component: index,
        meta: {
            title: '个人任务',
            open: 3,
            requireAuth: true  // 需要认证
        },
        children: [
            {
                path: 'await',
                name: 'await',
                component: await_,
                meta: {
                    requireAuth: true,
                    title: '待办任务',
                    selected: '10'
                }
            },
            {
                path: 'complete',
                name: 'complete',
                component: complete,
                meta: {
                    requireAuth: true,
                    title: '已完成任务',
                    selected: '11'
                }
            },
        ]
    },
]

export default route