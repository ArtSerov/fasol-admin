import axios from "axios";
import store from '@/store/index'

const API_URL = 'http://zamay86.pythonanywhere.com/api/'

const jwtInterceptor = axios.create()

jwtInterceptor.interceptors.request.use((config) => {
    const authData = store.getters["auth/getAuthData"];
    if (authData == null) {
        return config;
    }

    config.headers.common["Authorization"] = `Bearer ${authData.token}`;
    return config;
});

jwtInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === 401) {
            const authData = store.getters["auth/getAuthData"];
            let response = await axios.post(
                API_URL + 'token/refresh/',
                {refresh: authData.refreshToken}
            );
            await store.commit("auth/setauthData", response.data);
            error.config.headers[
                "Authorization"
                ] = `Bearer ${response.data['access']}`;
            return axios(error.config);
        } else {
            return Promise.reject(error);
        }
    }
);

export default jwtInterceptor;
