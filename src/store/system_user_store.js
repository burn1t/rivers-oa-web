import {ref} from 'vue'
import {defineStore} from 'pinia'
import {getToken, setToken, removeToken} from '@/utils/auth.js'
import {login, logout, getUserInfo} from '@/api/index.js'
import {message} from 'ant-design-vue'

export const SystemUserStore = defineStore('systemUserStore', () => {
    // 判断是否从登录页面放行
    const token = ref(false)
    const username = ref('')

    const systemLogin = async (formInfo) => {
        try {
            const {code, information, result} = await login(formInfo)
            if (code === 20000) {
                message.success(information)
                setToken(result)
                token.value = true
            }
        } catch (e) {
            console.log(e)
        }
    }
    const systemLogout = async () => {
        const {code, information} = await logout()
        if (code === 20000) {
            message.success(information)
            removeToken()
            token.value = false
        }
    }

    const getSystemUsername = async () => {
        const {code, result} = await getUserInfo()
        if (code === 20000) username.value = result
    }

    const $systemUserStoreReset = () => {
        token.value = false
        username.value = ''
    }
    return {token, username, systemLogin, systemLogout, getSystemUsername, $systemUserStoreReset}
})