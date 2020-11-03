import Vue from 'vue'
import Router from 'vue-router'
import Watchify1 from '@/components/Watchify.1'
import Watchify2 from '@/components/Watchify.2'
import Watchify3 from '@/components/Watchify.3'
import Watcher from '@/components/Watcher'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/watchify1'
    },
    {
      path: '/watchify1',
      name: 'watchify1',
      component: Watchify1
    },
    {
      path: '/watchify2',
      name: 'watchify2',
      component: Watchify2
    },
    {
      path: '/watchify3',
      name: 'watchify3',
      component: Watchify3
    },
    {
      path: '/watcher',
      name: 'watcher',
      component: Watcher
    }
  ],
  methods: {
    redirect (target) {
      this.$router.push(target)
    }
  }
})

export default router
