import {get, post, delete_} from '../utils/http.js'

export const addModel = (modelFormInfo) => {
    return post('/model', modelFormInfo)
}

export const getModel = (queryInfo) => {
    return post('/model/list', queryInfo)
}

export const deployModel = (modelId) => {
    return post(`/model/deploy/${modelId}`)
}

export const deleteModel = (modelId) => {
    return delete_(`/model/${modelId}`)
}

// 导出模型 ZIP
export const exportModelZip = async (modelId) => {
    return get(`/model/export/zip/${modelId}`, {
        responseType: 'blob'
    })
}