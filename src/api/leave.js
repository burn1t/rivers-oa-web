import {get, post, put} from '../utils/http.js'

export const addLeave = (leaveFormInfo) => {
    return post('/leave', leaveFormInfo)
}

export const getLeaveList = (queryInfo) => {
    return post('/leave/list', queryInfo)
}

export const getLeave = (id) => {
    return get(`/leave/${id}`)
}

export const updateLeave = (leaveFormInfo) => {
    return put('/leave/update', leaveFormInfo)
}
