import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./Routes";

const router = createRouter({
    routes,
    history: createWebHashHistory(process.env.BASE_URL)
});

export default router;