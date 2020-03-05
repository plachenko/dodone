import Vue from 'vue'
import VueRouter from 'vue-router'
import VApp from '../views/VApp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'VApp',
    component: VApp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
