import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import OAuth from '../views/OAuth.vue'
import VApp from '../views/VApp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'VApp',
    alias: '/dendo',
    children:[
      {
        path: 'oauth',
        component: OAuth
      }
    ],
    component: VApp,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
