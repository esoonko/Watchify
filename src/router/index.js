import Vue from 'vue'
import Router from 'vue-router'
import Watchify from '@/components/Watchify'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/watchify'
    },
    {
      path: '/watchify',
      name: 'watchify',
      component: Watchify
    }
  ],
  methods: {
    redirect (target) {
      this.$router.push(target)
    }
  }
})

export default router
