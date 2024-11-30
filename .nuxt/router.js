import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5350931e = () => interopDefault(import('../pages/addpoi.vue' /* webpackChunkName: "pages/addpoi" */))
const _94a0997a = () => interopDefault(import('../pages/homepage.vue' /* webpackChunkName: "pages/homepage" */))
const _323c7290 = () => interopDefault(import('../pages/leaderboard.vue' /* webpackChunkName: "pages/leaderboard" */))
const _258e3837 = () => interopDefault(import('../pages/poiinformation.vue' /* webpackChunkName: "pages/poiinformation" */))
const _b23cd7bc = () => interopDefault(import('../pages/skeleton.vue' /* webpackChunkName: "pages/skeleton" */))
const _411c28bf = () => interopDefault(import('../pages/swarming.vue' /* webpackChunkName: "pages/swarming" */))
const _30db0f5a = () => interopDefault(import('../pages/swarmresults.vue' /* webpackChunkName: "pages/swarmresults" */))
const _77f4abcd = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/addpoi",
    component: _5350931e,
    name: "addpoi"
  }, {
    path: "/homepage",
    component: _94a0997a,
    name: "homepage"
  }, {
    path: "/leaderboard",
    component: _323c7290,
    name: "leaderboard"
  }, {
    path: "/poiinformation",
    component: _258e3837,
    name: "poiinformation"
  }, {
    path: "/skeleton",
    component: _b23cd7bc,
    name: "skeleton"
  }, {
    path: "/swarming",
    component: _411c28bf,
    name: "swarming"
  }, {
    path: "/swarmresults",
    component: _30db0f5a,
    name: "swarmresults"
  }, {
    path: "/",
    component: _77f4abcd,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
