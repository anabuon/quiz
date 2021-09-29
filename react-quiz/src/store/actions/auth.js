import axios from '../../axios/axios-quiz'
import {AUTH_SUCCESS, AUTH_LOGOUT} from './actionTypes'

export function auth (email, password, isLogin) {
    return async dispatch => {
        const authData = {
        email, password,
        returnSecureToken: true    
        }

        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCLm4NHRUypjGpqx0v8oCJR19qja8We-a4'

        if (isLogin) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCLm4NHRUypjGpqx0v8oCJR19qja8We-a4'
        }

      const response = await axios.post(url, authData)
      
      const data = response.data

      const expirationData = new Date(new Date().getTime() + data.expiresIn * 1000)

      localStorage.setItem('token', data.idToken)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('expirationData', expirationData)

      dispatch(authSuccess(data.idToken))
      dispatch(autoLogout(data.expiresIn))
    }
}

export function autoLogout(time) {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, time * 1000)
    }
}

export function logout () {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('expirationData')
    return { 
        type: AUTH_LOGOUT
    }
}

export function authSuccess (token) {
    return {
        type: AUTH_SUCCESS, 
        token
    }
}

export function autoLogin() {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logout())
        } else {
            const expirationData = new Date(localStorage.getItem('expirationData')) 
            if(expirationData <= new Date()) {
                dispatch(logout())
            } else {
                dispatch(authSuccess(token))
                dispatch(autoLogout((expirationData.getTime() - new Date().getTime()) / 1000))
            }

        }
    }
}
