import { createRouter, createWebHistory } from 'vue-router';
import EnterName from './pages/index.vue';
import HomePage from './pages/homepage.vue';
import Swarming from './pages/swarming.vue';
import SwarmingResults from './pages/swarmresults.vue';
import POIInformation from './pages/poiinformation.vue'
import AddNewPOI from './pages/addpoi.vue'
import Leaderboard from './pages/leaderboard.vue';
import NewBucket from './pages/bucket.vue'
import SubmitPOI from './pages/submitpoi.vue'
import Tutorial1 from './pages/tutorial_1.vue';
import Tutorial2 from './pages/tutorial_2.vue';
import Tutorial3 from './pages/tutorial_3.vue';
import Tutorial4 from './pages/tutorial_4.vue';


const routes = [
    { path: '/swarming', component: Swarming },
    { path: '/swarmresults', component: SwarmingResults },
    { path: '/poiinformation', component: POIInformation},
    { path: '/addnewpoi', component: AddNewPOI},
    { path: '/homepage', component: HomePage},
    { path: '/leaderboard', component: Leaderboard },
    { path: '/newbucket', component: NewBucket },
    { path: '/submitpoi', component: SubmitPOI },
    { path: '/tutorial_1', component: Tutorial1 },
    { path: '/tutorial_2', component: Tutorial2 },
    { path: '/tutorial_3', component: Tutorial3 },
    { path: '/tutorial_4', component: Tutorial4 },
    { path: '/', component: EnterName}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;