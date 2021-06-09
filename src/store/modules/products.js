import jwtInterceptor from "@/shared/jwtInterceptor";

const API_URL = "http://127.0.0.1:8000/api/"

const state = () => ({
    products:[],
    productCount:0,
    product:null
})

const getters = {
    allProducts(state){
        return state.products
    },
    selectProduct(state){
        return state.product
    },
    productsCount(state){
        return state.productCount
    }
}

const actions = {
    async getAllProducts({commit},page){
        const response =
            await jwtInterceptor.get(`${API_URL}products/?page=${page}`)
                .catch(error =>{
                    console.log(error)
                })
        if(response && response.data){
            commit('setCount', response.data.total)
            commit('setProducts',response.data.results)
        }
    },
    async getProduct({commit}, id){
        const response =
            await jwtInterceptor.get(`${API_URL}products/${id}`)
                .catch(error =>{
                    console.log(error)
                })
        if (response && response.data){
            commit('setProduct', response.data)
        }
    },
    async createProduct({commit}, payload){
        await jwtInterceptor.post(`${API_URL}products/`, payload.data)
            .then(res => commit('setNewProduct', res.data))
            .catch(error => {
                console.log(error.response)
            })
    },
    async deleteProduct({commit}, id){
        await jwtInterceptor.delete(`${API_URL}products/${id}`)
            .catch(error => {
                console.log(error)
            })
        commit('removeProduct',id)
    },
    async patchChangeProduct(context, payload){
        await jwtInterceptor.patch(`${API_URL}products/${payload.id}`, payload.data)
            .then(res => console.log(res))
            .catch(error => {
                console.log(error)
            })
    },
    async getSearchProduct({commit}, payload){
        const response =
            await jwtInterceptor.get(`${API_URL}products/?search=${payload}`)
                .catch(error => {
                    console.log(error)
                })
        if(response && response.data){
            commit('setCount', response.data.total)
            commit('setProducts',response.data.results)
        }
    },

}
const mutations = {
    setProducts(state, products) {
        state.products = products
    },
    setProduct(state, product) {
        state.product = product
    },
    setNewProduct(state, product) {
        state.products.push(product)
    },
    removeProduct(state, productId) {
        state.products = state.products.filter(product => product.id !== productId)
    },

    setCount(state, count) {
        state.productCount = count
    },
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}