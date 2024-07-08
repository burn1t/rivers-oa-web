import {get, post} from '../utils/http.js'

export const getWaitingTaskList = (queryInfo) => {
    return post('/task/list/waiting', queryInfo)
}

export const claimTask = (taskId) => {
    return post(`/task/claim/${taskId}`)
}

export const getTaskNodeInfo = (taskId) => {
    return get(`/task/next/${taskId}`)
}

export const completeTask = (formInfo) => {
    return post('/task/complete', formInfo)
}

export const turnTask = (taskId, assignee) => {
    return post(`/task/turn/${taskId}/${assignee}`)
}

export const getBackTaskHistoryList = (taskId) => {
    return post(`/task/list/back/${taskId}`)
}

export const backToTargetTask = (taskId, targetTaskId) => {
    return post(`/task/back/${taskId}/${targetTaskId}`)
}

export const getCompletedTaskList = (formInfo) => {
    return post('/task/list/completed', formInfo)
}