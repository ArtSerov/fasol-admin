import jwtInterceptor from "@/shared/jwtInterceptor";

const API_URL = this.$store.getters.getServerUrl

const state = () => ({
    categories:[],
    subcategories:[],
    allSubcategories:[],
})

const getters = {
    allCategories(state){
        return state.categories
    },
    allSubcategories(state){
        return state.allSubcategories
    },
    selectSubcategories(state){
        return state.subcategories
    }
}

const actions = {
    async getAllCategories({commit}){
        const response =
            await jwtInterceptor.get(`${API_URL}categories`)
                .catch(error =>{
                    console.log(error)
                })
        if(response && response.data){
            commit('setCategories',response.data)
        }
    },
    async createCategory({commit}, payload){
        await jwtInterceptor.post(`${API_URL}categories/`, payload.data)
            .then(res => commit('setNewCategory', res.data))
            .catch(error => {
                console.log(error)
            })
    },
    async deleteCategory({commit}, id){
        await jwtInterceptor.delete(`${API_URL}categories/${id}`)
            .catch(error => {
                console.log(error)
            })
        commit('removeCategory',id)
    },
    async patchChangeCategory(context, payload){
        await jwtInterceptor.patch(`${API_URL}categories/${payload.id}`, payload.data)
            .then(res => console.log(res))
            .catch(error => {
                console.log(error)
            })
    },


    async getAllSubcategories({commit}){
        const response =
            await jwtInterceptor.get(`${API_URL}subcategories`)
                .catch(error =>{
                    console.log(error)
                })
        if(response && response.data){
            commit('setAllSubcategories',response.data)
        }
    },
    async getSelectSubcategories({commit},id){
        const response =
            await jwtInterceptor.get(`${API_URL}subcategories/?category=${id}`)
                .catch(error =>{
                    console.log(error)
                })
        if(response && response.data){
            commit('setSubcategories',response.data)
        }
    },
    async createSubcategory({commit}, payload){
        console.log(payload)
        await jwtInterceptor.post(`${API_URL}subcategories/`,
            {
                category:payload.category,
                name:payload.name
            })
            .then(res => commit('setNewSubcategory', res.data))
            .catch(error => {
                console.log(error)
            })
    },
    async patchChangeSubcategory(context, payload){
        await jwtInterceptor.patch(`${API_URL}subcategories/${payload.id}`,{
            name:payload.name
        })
            .catch(error =>{
                console.log(error)
            })
    },
    async deleteSubcategory({commit}, id){
        await jwtInterceptor.delete(`${API_URL}subcategories/${id}`)
            .catch(error => {
                console.log(error)
            })
        commit('removeSubcategory',id)
    }
}

const mutations = {
    setCategories(state,categories){
        state.categories = categories
    },
    setSubcategories(state, subcategories){
        state.subcategories = subcategories
    },
    setAllSubcategories(state, subcategories){
        state.allSubcategories = subcategories
    },
    setNewCategory(state, category){
        state.categories.push(category)
    },
    setNewSubcategory(state, subcategory){
        state.subcategories.push(subcategory)
    },
    removeCategory(state, categoryId){
        state.categories = state.categories.filter(category => category.id !== categoryId )
    },
    removeSubcategory(state, subcategoryId){
        state.subcategories = state.subcategories.filter(subcategory => subcategory.id !== subcategoryId )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}