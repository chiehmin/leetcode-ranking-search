import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Contest from '../views/Contest.vue'
import GlobalRanking from '../views/GlobalRanking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/contest',
    name: 'Contest',
    component: Contest
  },
  {
    path: '/global_ranking',
    name: 'GlobalRanking',
    component: GlobalRanking
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
