import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _b1b0c8f2 = () => interopDefault(import('../pages/addpoi.vue' /* webpackChunkName: "pages/addpoi" */))
const _19b2ba30 = () => interopDefault(import('../pages/bucket.vue' /* webpackChunkName: "pages/bucket" */))
const _6fe6456c = () => interopDefault(import('../pages/homepage.vue' /* webpackChunkName: "pages/homepage" */))
const _8946d022 = () => interopDefault(import('../pages/leaderboard.vue' /* webpackChunkName: "pages/leaderboard" */))
const _b42270c0 = () => interopDefault(import('../pages/poiinformation.vue' /* webpackChunkName: "pages/poiinformation" */))
const _6118264b = () => interopDefault(import('../pages/skeleton.vue' /* webpackChunkName: "pages/skeleton" */))
const _617810b8 = () => interopDefault(import('../pages/submitpoi.vue' /* webpackChunkName: "pages/submitpoi" */))
const _095a8a30 = () => interopDefault(import('../pages/swarming.vue' /* webpackChunkName: "pages/swarming" */))
const _8954979e = () => interopDefault(import('../pages/swarming-joystick.vue' /* webpackChunkName: "pages/swarming-joystick" */))
const _b1608a5e = () => interopDefault(import('../pages/swarming-mousemove.vue' /* webpackChunkName: "pages/swarming-mousemove" */))
const _bb1c6408 = () => interopDefault(import('../pages/swarmresults.vue' /* webpackChunkName: "pages/swarmresults" */))
const _30567244 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _b1b0c8f2,
    name: "addpoi"
  }, {
    path: "/bucket",
    component: _19b2ba30,
    name: "bucket"
  }, {
    path: "/homepage",
    component: _6fe6456c,
    name: "homepage"
  }, {
    path: "/leaderboard",
    component: _8946d022,
    name: "leaderboard"
  }, {
    path: "/poiinformation",
    component: _b42270c0,
    name: "poiinformation"
  }, {
    path: "/skeleton",
    component: _6118264b,
    name: "skeleton"
  }, {
    path: "/submitpoi",
    component: _617810b8,
    name: "submitpoi"
  }, {
    path: "/swarming",
    component: _095a8a30,
    name: "swarming"
  }, {
    path: "/swarming-joystick",
    component: _8954979e,
    name: "swarming-joystick"
  }, {
    path: "/swarming-mousemove",
    component: _b1608a5e,
    name: "swarming-mousemove"
  }, {
    path: "/swarmresults",
    component: _bb1c6408,
    name: "swarmresults"
  }, {
    path: "/",
    component: _30567244,
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
