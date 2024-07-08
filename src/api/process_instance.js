import {get, post, put, delete_} from '../utils/http.js'

export const startupProcessInstance = (submitApplyData) => {
    return post('/instance/startup', submitApplyData)
}

export const cancelProcessInstance = (businessKey, processInstanceId, message) => {
    return delete_(`/instance/${businessKey}/${processInstanceId}/${message}`)
}

export const getFormName = (processInstanceId) => {
    return get(`/instance/formname/${processInstanceId}`)
}

export const getTaskHistoryInfoList = (processInstanceId) => {
    return get(`/instance/list/task/history/${processInstanceId}`)
}

export const getProcessHistoryImg = (processInstanceId) => {
    return get(`/instance/img/history/${processInstanceId}`)
}

export const getRunningProcessInstanceList = (formInfo) => {
    return post('/instance/list/running', formInfo)
}

export const updateProcessInstanceState = (processInstanceId) => {
    return put(`/instance/state/${processInstanceId}`)
}

export const deleteProcessInstance = (processInstanceId) => {
    return delete_(`/instance/${processInstanceId}`)
}

export const getFinishProcessInstanceList = (formInfo) => {
    return post('/instance/list/finish', formInfo)
}

export const deleteFinishProcessHistory = (processInstanceId) => {
    return delete_(`/instance/history/${processInstanceId}`)
}