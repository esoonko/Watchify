import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Vote from '@/components/Vote'
import Statistic from '@/components/Statistic'
import Watchify from '@/components/Watchify'
import RequestService from '../services/RequestService'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/watchify'
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/vote',
      name: 'vote',
      component: Vote,
      meta: { requiresAuth: true }
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: Statistic,
      meta: { requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    verify().then(function (autherised) {
      if (autherised !== false) {
        next()
      } else {
        next({path: '/login'})
      }
    })
  } else {
    next()
  }
})

async function verify () {
  try {
    const response = await RequestService.verifyToken({
      token: Vue.cookies.get('token')
    })
    return response
  } catch (error) {
    return false
  }
}

export default router
