import api from "./api.js"; //для авторизаций и регистраций
import mainApi from "./mainApi.js"; //Для остального контента
import { ref } from "vue"; // реактивность

export const useProfile = defineStore('profileValue', {
    state: () => ({
        profile: ref([])
    }),
    actions:
    {
        async getProfile() {
            const token = localStorage.getItem('token')
            const res = await mainApi.post("/User/GetUser", {token});
            if (res.data) {
                this.profile = res.data;
            } else {
                console.error('No data received');
            }
            return this.profile;
        },
    }

});

export async function getConfCode(phoneNumber)
{
    const res = await api.post("/User/register-or-login", {
        phoneNumber: phoneNumber
    });
    return res.data
}

export async function Verify(PhoneNumber, Code)
{
    const res = await api.post("/User/verify", {
        PhoneNumber: PhoneNumber,
        Code: Code
    });
    return res.data
}
//Выход
export async function Logout()
{
    const res = await  mainApi.get("/User/Logout",{
        params:
            {
                AuthToken: localStorage.getItem('token')
            }
    })

    return res.data
}
