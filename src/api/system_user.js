import {get, post} from '../utils/http.js'

export const login = (loginFormInfo) => {
    return post('/user/login', loginFormInfo)
}

export const logout = () => {
    return get('/user/logout')
}

export const getUserInfo = () => {
    return get('/user/info')
}