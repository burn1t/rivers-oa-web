const index = () => import('../views/Index.vue')
const welcome = () => import('../views/auxiliary/Welcome.vue')
const center = () => import('../views/auxiliary/PersonalCenter.vue')
const chat = () => import('../views/auxiliary/Chat.vue')

const routes = [
    {
        path: '/',
        redirect: '/welcome',
        component: index,
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: '/welcome',
                name: 'welcome',
                component: welcome,
                meta: {
                    title: '欢迎',
                }
            },
            {
                path: '/center',
                name: 'center',
                component: center,
                meta: {
                    requireAuth: true,
                    title: '个人用户中心'
                }
            },
            {
                path: '/chat',
                name: 'chat',
                component: chat,
                meta: {
                    requireAuth: true,
                    title: '聊天'
                }
            }
        ]
    },
]

export default routes