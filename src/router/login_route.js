const login = () => import('../views/Login.vue')

const routes = [
    {
        path: '/login',
        component: login,
        name: 'login'
    }
]

export default routes