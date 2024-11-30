import { createRouter, createWebHistory } from 'vue-router';
import EnterName from './pages/index.vue';
import HomePage from './pages/homepage.vue';
import Swarming from './pages/swarming.vue';
import SwarmingResults from './pages/swarmresults.vue';
import POIInformation from './pages/poiinformation.vue'
import AddNewPOI from './pages/addpoi.vue'
import Leaderboard from './pages/leaderboard.vue';
import NewBucket from './pages/bucket.vue'

const routes = [
    { path: '/swarming', component: Swarming },
    { path: '/swarmresults', component: SwarmingResults },
    { path: '/poiinformation', component: POIInformation},
    { path: '/addnewpoi', component: AddNewPOI},
    { path: '/homepage', component: HomePage},
    { path: '/leaderboard', component: Leaderboard },
    { path: '/newbucket', component: NewBucket },
    { path: '/', component: EnterName}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;