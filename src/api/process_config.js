import {get, post, delete_} from '../utils/http.js'

export const getProcessConfig = (processKey) => {
    // console.log(processKey)
    return get(`/process/config/${processKey}`)
}

export const saveOrUpdateProcessConfig = (formInfo) => {
    console.log(formInfo)
    return post('/process/config', formInfo)
}