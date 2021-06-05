import {jwtDecrypt, tokenAlive} from '@/shared/jwtHelper'
import axios from "axios";

const API_URL = this.$store.getters.getServerUrl

const state = () => ({
    authData: {
        token: "",
        refreshToken: "",
        tokenExp: "",
        userId: "",
    },
    loginApiStatus: ''
})

const getters = {
    getLoginApiStatus(state) {
        return state.loginApiStatus;
    },
    getAuthData(state) {
        return state.authData
    },
    isTokenAlive(state) {
        if (!state.authData.tokenExp) {
            return false
        }
        if (!tokenAlive(state.authData.tokenExp)){
            const decrypted = jwtDecrypt(state.authData.refreshToken)
            return tokenAlive(decrypted.exp)
        }
        return tokenAlive(state.authData.tokenExp)
    }

}

const actions = {
    async login({commit}, payload) {
        let response = await axios
            .post(API_URL + 'token/', {
            phone: payload.phone,
            password: payload.password
        })
            .catch(error => {
                console.log(error)
            })
        const decrypted = jwtDecrypt(response.data['access'])
        if (response && response.data && decrypted.isAdmin) {
            commit('setauthData', response.data)
            commit('setLoginApiStatus', 'success')
        } else {
            commit('setLoginApiStatus', 'failured')
        }
    },
    logout({commit}){
        commit('setauthData', null)
    }
}

const mutations = {
    setauthData(state, data) {
        if (data) {
            const decrypted = jwtDecrypt(data['access'])
            localStorage.setItem('access_token', data['access'])
            localStorage.setItem('refresh_token', data['refresh'])
            const newAuthData = {
                token: data['access'],
                refreshToken: data['refresh'],
                tokenExp: decrypted.exp,
                userId: decrypted.user_id,
            }
            state.authData = newAuthData
        }else{
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            state.authData = {
                token: "",
                refreshToken: "",
                tokenExp: "",
                userId: "",
            }
        }
    },
    setLoginApiStatus(state, data) {
        state.loginApiStatus = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}