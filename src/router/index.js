import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/AuthLogin.vue'),
    meta: { authLayout: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/AuthRegister.vue'),
    meta: { authLayout: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/add',
    name: 'add',
    component: () => import('../views/CatalogAdd.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const authLayout = to.matched.some(r => r.meta.authLayout)

  if ( requiresAuth && !auth.currentUser ) {
    next('/login')
  } else if (authLayout && auth.currentUser ) {
    // if ( from.name == '/' && to.path != '/') {
      next('/')
    // } else {
      // next()
    // }
  } else {
    next()
  }
})

export default router
