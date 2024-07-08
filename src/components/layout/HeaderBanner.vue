<template>
    <header>
<!--        <h1>-->
<!--            <router-link to="/chat">Chat</router-link>-->
<!--        </h1>-->
        <h1>
            <router-link to="/center">{{ username }}</router-link>
        </h1>
        <h1 @click="handleLogout">Logout</h1>
    </header>
</template>

<script setup>
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {SystemUserStore} from '@/store'

const router = useRouter()
const systemUserStore = SystemUserStore()
const {username} = storeToRefs(systemUserStore)
const {getSystemUsername, systemLogout, $systemUserStoreReset} = systemUserStore

getSystemUsername()

const handleLogout = () => {
    $systemUserStoreReset()
    systemLogout()
    router.push('/login')
}
// watch(() => systemUserStore.token, value => {
//     if (!value) router.push('/login')
// })
// console.log(systemUserStore.token)
</script>

<style scoped lang="less">
header {
    display: flex;
    align-items: center;
    justify-content: end;
    height: 35px;
    padding: 0 30px;

    h1 {
        cursor: pointer;
        margin-left: 20px;
    }
}
</style>
