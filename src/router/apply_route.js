const index = () => import('../views/Index.vue')
const leave = () => import('../views/apply/Leave.vue')
const loan = () => import('../views/apply/Loan.vue')
const route = [
    {
        path: '/apply',
        redirect: '/apply/leave',
        component: index,
        meta: {
            title: '业务办理',
            open: 2,
            requireAuth: true  // 需要认证
        },
        children: [
            {
                path: 'leave',
                name: 'leave',
                component: leave,
                meta: {
                    requireAuth: true,
                    title: '请假业务',
                    selected: '7'
                }
            },
            {
                path: 'loan',
                name: 'loan',
                component: loan,
                meta: {
                    requireAuth: true,
                    title: '借款业务',
                    selected: '8'
                }
            },
        ]
    },
]

export default route