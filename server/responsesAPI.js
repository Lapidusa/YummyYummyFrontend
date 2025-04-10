import api from "./api.js";
import { ref } from "vue";

export async function getStoresMain()
{
    const res = await api.get("/Main/GetAllStores");
    return res.data
}

export const useProfile = defineStore('profileValue', {
    state: () => ({
        profile: ref([])
    }),
    actions:
    {
        async getProfile() {
            const token = localStorage.getItem('token')
            const res = await api.get("/user/get-user",
                {
                    headers: {
                        'token': token
                    },
                });
            if (res.data) {
                this.profile = res.data;
            } else {
                console.error('No data received');
            }
            return this.profile;
        }
    }
});

export async function GetConfCode(phoneNumber)
{
    const res = await api.post("/user/send-sms", {
        phone_number: phoneNumber
    });
    return res.data
}

export async function Verify(PhoneNumber, Code)
{
    const res = await api.post("/user/verify-code", {
        phone_number: PhoneNumber,
        code: Code
    });
    console.log(res.data.token)
    localStorage.setItem('token', res.data.token);
    return res.data
}
//Выход
export async function Logout()
{
    const res = await api.post("/user/logout",{
        token: localStorage.getItem('token')
    })

    return res.data
}

//Отправка корзины на сервер
export async function AddBasket(cartItems)
{
    const res = await api.post("/Basket/Add",{
        token: {
            token: localStorage.getItem('token'),
        },
        order: {
            products: cartItems.map(item => {
                return {
                    productId: item.id,
                    quantity: item.quantity,
                    selectedVariantId: item.pizzaVariants[0].id || item.variants[0].id
                };
            })
        }
    })

    return res.data
}
//Магазины
export async function GetAllStores()
{
    const res = await  api.post("/Store/GetAll",{
        token: localStorage.getItem('token')
    })

    return res.data
}
export async function CreateStore(address, startWorkingHours, endWorkingHours, startDeliveryTime, endDeliveryTime, phoneNumber) {
    const res = await api.post(`/Store/Create`, {
        token: {
            token: localStorage.getItem('token')
        },
        store: {
            address: address,
            startWorkingHours: startWorkingHours,
            endWorkingHours: endWorkingHours,
            startDeliveryTime: startDeliveryTime,
            endDeliveryTime: endDeliveryTime,
            phoneNumber: phoneNumber,
        }
    })

    return res.data;
}

export async function GetStoreById(storeId) {
    const res = await api.post(`/Store/GetById?id=${storeId}`, {
        token: localStorage.getItem('token') // Send the token directly as a string
    });

    return res.data;
}

export async function UpdateStore(storeId, address, startWorkingHours, endWorkingHours, startDeliveryTime, endDeliveryTime, phoneNumber) {
    const res = await api.post(`/Store/Update?id=${storeId}`, {
        token: {
            token:localStorage.getItem('token')
        },
        store: {
            address: address,
            startWorkingHours: startWorkingHours,
            endWorkingHours: endWorkingHours,
            startDeliveryTime: startDeliveryTime,
            endDeliveryTime: endDeliveryTime,
            phoneNumber: phoneNumber,
        }
    });

    return res.data;
}

export async function DeleteStore(storeId) {
    const res = await api.post(`/Store/Delete?id=${storeId}`, {
        token:localStorage.getItem('token')
    });

    return res.data;
}
//Категории
export async function CreateCategory(storeId, name, description) {
    const res = await api.post(`/Category/Create`, {
        token:{
            token: localStorage.getItem('token'),
        },
        category:{
            storeId:storeId,
            name: name,
            description: description
        }
    });

    return res.data;
}

export async function getThisCategory(storeId){
    const token = localStorage.getItem('token');
    const res = await api.get(`/Category/GetCategoryByStore/${storeId}`, {
        headers: {
            'token': token
        }
    });

    return res.data;
}

export async function UpdateCategory(categoryId, storeId, name, description) {
    const res = await api.post(`/Category/Update?id=${categoryId}`, {
        token:{
            token: localStorage.getItem('token'),
        },
        category:{
            storeId:storeId,
            name: name,
            description: description
        }
    });

    return res.data;
}

export async function DeleteCategory(categoryId) {
    const res = await api.post(`/Category/Delete?id=${categoryId}`, {
        token:localStorage.getItem('token')
    });
    return res.data;
}
// Продукты

export async function GetProduct(productId)
{
    const token = localStorage.getItem('token');
    const res = await api.get(`/Product/Get/${productId}`, {
        headers: {
            'token': token
        }
    });

    return res.data;
}

export async function CreateProduct(formData)
{
    formData.append('Token',localStorage.getItem('token'))
    const res = await api.post(`/Product/Create`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
}

export async function UpdateProduct(formData)
{
    formData.append('Token',localStorage.getItem('token'))
    const res = await api.post(`/Product/Update`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return res.data;
}
export async function DeleteProduct(productId) {
    const res = await api.delete(`/Product/Delete/${productId}`, {
        headers: {
            token: localStorage.getItem('token')
        }
    });
    return res.data;
}

export async function ExportTables(){
    const response = await api.get('/Exsim/export-all', {
        responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AllTables.xlsx');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

export async function ImportTables(fileFromData){
    const res = await api.post(`/Exsim/import-excel`, fileFromData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}