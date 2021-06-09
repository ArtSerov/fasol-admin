import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'main',
            meta: {layout: 'auth', authRequired: false},
            component:()=>import('./views/Main')
        },
        {
            path: '/login',
            name: 'login',
            meta: {layout: 'auth', authRequired: false},
            component:()=>import('./views/Login')
        },
        {
            path: '/categories',
            name: 'categories',
            meta: {layout: 'main', authRequired: true},
            component: ()=>import('./views/Categories')
        },
        {
            path: '/orders',
            name: 'orders',
            meta: {layout: 'main', authRequired: true},
            component: ()=>import('./views/Orders')
        },
        {
            path: '/products',
            name: 'products',
            meta: {layout: 'main', authRequired: true},
            component: ()=>import('./views/Products')
        },
    ]
})

router.beforeEach((to, from, next)=>
{
    const authData = store.getters['auth/getAuthData']
    if(!authData.token){
        const access_token = localStorage.getItem('access_token')
        const refresh_token = localStorage.getItem('refresh_token')
        if(access_token){
            const data = {
                access:access_token,
                refresh:refresh_token
            }
            store.commit('auth/setauthData', data)
        }
    }


    const isAuthenticated = store.getters['auth/isTokenAlive']
    const requireAuth = to.matched.some(record => record.meta.authRequired)
    if(requireAuth && !isAuthenticated){
        store.commit('auth/setauthData', null)
        next('/login')
    }else if(!requireAuth && isAuthenticated){
        next('/orders')
    }else{
        next()
    }
})

export default router