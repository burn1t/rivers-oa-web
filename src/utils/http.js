import axios from 'axios'
import {getToken} from './auth.js'
import {message} from 'ant-design-vue'

const instance = axios.create({
    // baseURL: 'http://124.222.82.27:8080/api/v1.0/workflow',
    baseURL: 'http://localhost:8080/api/v1.0/workflow',
    timeout: 5000,
})

instance.interceptors.request.use(config => {
    // 添加 token
    if (getToken()) config.headers['token'] = getToken()
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(async response => {
    /* 服务器成功处理请求，并返回请求的资源 */
    const {headers, data, data: {code, information}} = response
    console.log(data)
    // 处理二进制
    if (headers['content-type'] === 'application/octet-stream') return response
    if (headers['content-type'] === 'image/svg+xml') return response
    // 处理响应
    if (code === 20000)
        return data
    else
        message.error(`${code} error: ${information}`, 5)
    return Promise.reject(new Error(`${code} error ${information}` || 'error'))
}, async error => {
    /* 无法发送请求，或无法处理的异常 */
    message.error(`error: ${error['message']}`, 10)
    return Promise.reject(error)
})

export const get = (url, config) => {
    return instance.get(url, config)
}

export const post = (url, data) => {
    return instance.post(url, data)
}

export const put = (url, data) => {
    return instance.put(url, data)
}

export const delete_ = (url, params) => {
    params = params || {}
    return instance.delete(url, {params})
}

export default instance