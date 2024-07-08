<template>
    <div id="container-box">
        <div id="sidebar">
            <sidebar/>
        </div>
        <article>
            <header-banner/>
            <main>
                <breadcrumb/>
                <a-card id="card">
                    <a-config-provider :theme="{token: {colorPrimary: '#0c86ea'}}">
                        <router-view/>
                    </a-config-provider>
                </a-card>
            </main>
            <footer/>
        </article>
    </div>
</template>

<script setup>
import {Sidebar, HeaderBanner, Breadcrumb} from '@/components'
</script>

<style scoped lang="less">
#container-box {
    display: flex;
    width: 100%;
    min-width: 1400px;

    #sidebar {
        background-color: #001529;
    }

    article {
        flex: 1;
        width: 100%;

        main {
            background-color: #f0f0f0;
            padding: 10px;

            #card {
                width: 100%;
                min-height: 670px;
            }
        }

        footer {
            height: 25px;
        }
    }
}
</style>
