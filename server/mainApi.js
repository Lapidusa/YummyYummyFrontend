import axios from "axios";
import listUrl from "./ListURL.js";
import {Logout} from "./responsesAPI.js";
import { useRouter } from 'vue-router';

const router = useRouter();

const mainApi = axios.create({
    baseURL: `${listUrl.apiUrl}`
});

mainApi.interceptors.request.use(config => {

    let authtoken = localStorage.getItem('token');
    let link = 'http://localhost:3000/';
    if (authtoken === null)
    {
        window.location.href = link
    }

    return config
})
mainApi.interceptors.response.use((config) => {

    let link = (process.env.NODE_ENV === 'production') ? 'https://youevents.keysystems.ru/client/index.html#/' : 'http://localhost:8080/#/';
    if(config.data.errorcode === 1)
    {
        Logout().then();
        localStorage.clear();
        window.location.href = link
    }

    return config
}, async (error) => {
    switch (String(error.response.status)) {
        case '403':
            router.push({path: "/:catchAll(.*)"});
            error.response.status = 200;
            break
        case '401':
            localStorage.clear()
            router.push({path: "/:catchAll(.*)"});
            break
    }
})
export default mainApi