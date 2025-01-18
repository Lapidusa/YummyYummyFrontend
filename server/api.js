import axios from "axios";
import listUrl from "../server/ListURL.js";
// import {Logout} from "~/server/responsesAPI.js";

const api = axios.create({
    baseURL: `${listUrl.apiUrl}`,
});

//Проверка ответа
// api.interceptors.response.use((config) => {
//
//     if(config.data.errorcode === 1)
//     {
//         Logout().then();
//         localStorage.clear();
//         this.$router.push("/");
//     }
//
//     return config
// }, async (error) => {
//     switch (String(error.response.status)) {
//         case '403':
//             this.$router.push("/:catchAll(.*)");
//             error.response.status = 200;
//             break
//         case '401':
//             localStorage.clear()
//             window.location ="/"
//             break
//         case '500':
//             this.$router.push("/:catchAll(.*)");
//             break
//     }
// })

export default api