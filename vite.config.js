import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import removeConsole from 'vite-plugin-remove-console'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        removeConsole({
            exclude: ['./src/utils/slogans.js']
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
})
