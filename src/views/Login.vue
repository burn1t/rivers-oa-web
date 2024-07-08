<template>
    <div id="container">
        <header id="logo">
            <img src="@/assets/img/model.png" alt="model">
        </header>

        <article>
            <header>
                <h1>Sign in to Rivers Office Automation System</h1>
            </header>

            <main>
                <a-form layout="vertical" :model="loginFormInfo">
                    <a-form-item label="Username or job number">
                        <a-input size="large"
                                 autocomplete="off"
                                 v-model:value="loginFormInfo.username"/>
                    </a-form-item>
                    <a-form-item label="Password">
                        <a-input-password autocomplete="off"
                                          size="large"
                                          @click.prevent
                                          v-model:value="loginFormInfo.password"/>
                    </a-form-item>
                    <a-form-item>
                        <a-button id="login-button" block
                                  @click="systemLogin(loginFormInfo)">Sign in</a-button>
                    </a-form-item>
                </a-form>
            </main>
        </article>
    </div>
</template>

<script setup>
import {reactive, watch} from 'vue'
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {SystemUserStore} from '@/store'

const router = useRouter()
const systemUserStore = SystemUserStore()
const {token} = storeToRefs(systemUserStore)
const {systemLogin, $systemUserStoreReset} = systemUserStore

$systemUserStoreReset()

const loginFormInfo = reactive({
    username: 'Floyd',
    password: '123456'
})

watch(() => token.value, value => {
    if (value) router.push('/welcome')
})
</script>

<style scoped lang="less">
#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    #logo {
        width: 65px;
        height: 65px;
        margin: 50px 0;

        img {
            width: 100%;
        }
    }

    header {
        margin-bottom: 55px;
        text-align: center;

        h1 {
            font-size: 24px;
            font-weight: 300;
            letter-spacing: 0.5px;
        }
    }

    main {
        padding: 15px 20px;
        border: 1px solid #d1d8df;
        border-radius: 6px;
        background-color: #f6f8fa;
    }
}

#login-button {
    background-color: #ad8bff;
    height: 40px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;

    &:hover {
        border: 1px solid #ad8bff;
        background-color: #936af8;
        color: #ffffff;

    }
}
</style>
