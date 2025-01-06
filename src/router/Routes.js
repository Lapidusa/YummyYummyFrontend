import {listUrl} from '../../server/ListURL.js';
import { defineNuxtConfig } from 'nuxt3';

const guard = (nameRout) =>
{
    let token = localStorage.getItem('authtoken')
    let link = listUrl.apiUrl

    if (token !== null) {
        setTimeout(() => {
            window.location.href = link + nameRout;
        }, 100);
    }
};
export default defineNuxtConfig({
    routes: [
        {
            path: '/admin',
            name: 'AdminPanel',
            component: () => import('~/pages/AdminPage.vue'),
        },
    ],
});