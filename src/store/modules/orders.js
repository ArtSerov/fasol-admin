import jwtInterceptor from "@/shared/jwtInterceptor";

const API_URL = "http://127.0.0.1:8000/api/"

const state = () => ({
    orders:[]
})

const getters = {
    allOrders(state){
        return state.orders
    }
}

const actions = {
    async getAllOrders({commit}, status){
        const response =
            await jwtInterceptor.get(`${API_URL}orders/?status=${status}`)
            .catch(error =>{
                console.log(error)
            })
        if(response && response.data){
            commit('setOrders',response.data)
        }
    },
    async patchChangeStatus(context, payload){
            await jwtInterceptor.patch(`${API_URL}orders/${payload.pk}`,{
                status:payload.status
            })
                .catch(error =>{
                    console.log(error)
                })
    },
    async deleteOrder({commit}, payload){
        const response = await jwtInterceptor.delete(`${API_URL}orders/${payload.pk}`)
            .catch(error =>{
                console.log(error.message)
            })
        if(response){
            commit('deleteOrder',payload.pk)
        }

    }


}

const mutations = {
    setOrders(state, orders){
        state.orders = orders
    },
    deleteOrder(state, orderId){
        state.orders = state.orders.filter(order => order.id !== orderId )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}