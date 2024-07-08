import {get, post, put, delete_} from '../utils/http.js'
import {getToken} from '../utils/auth.js'

export const getDefinition = (queryInfo) => {
    return post('/definition/list', queryInfo)
}

export const updateDefinitionState = (id) => {
    return put(`/definition/state/${id}`)
}

export const deleteDefinition = (deploymentId, processKey) => {
    return delete_(`/definition/${deploymentId}/${processKey}`);
}

// 导出流程定义 XML or PNG
export const exportDefinitionXmlOrPng = async (type, id) => {
    const response = await get(`/definition/export/${type}/${id}`, {
        responseType: 'blob'
    })
    const blob = new Blob([response['data']], {
        type: 'application/octet-stream'
    })
    const url = window.URL.createObjectURL(blob)
    const fileName = response['headers']['content-disposition'].split(';')[1].split("=")[1]

    const a = document.createElement('a')
    a.href = url
    a.download = decodeURI(fileName)
    document.body.appendChild(a)
    a.style.display = 'none'
    a.click()

    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}

export const getDefinitionImgBlob = async (id) => {
    return get(`/definition/export/png/${id}`, {
        responseType: 'blob',
    })
    // const response = await get(`/definition/export/png/${props.id}`, {
    //     responseType: 'blob',
    // })
    // const blob = new Blob([response['data']], {
    //     type: 'application/octet-stream'
    // })
    // return window.URL.createObjectURL(blob)
}