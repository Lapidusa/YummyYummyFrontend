<template>

<div v-if="isLoading" class="flex flex-col items-baseline gap-2">
  <p><b>id:</b> {{infoStore.id}}</p>
  <p><b>Адрес:</b> {{infoStore.address}}</p>
  <p><b>Время работы:</b> {{infoStore.startWorkingHours.substring(0,5)}} - {{infoStore.endWorkingHours.substring(0,5)}}</p>
  <p><b>Время доставки:</b> {{infoStore.startDeliveryTime.substring(0,5)}} - {{infoStore.endDeliveryTime.substring(0,5)}}</p>
  <p><b>Рабочий телефон:</b> {{infoStore.phoneNumber}}</p>
  <template v-if="infoStore.categories.length !==0 ">
    Категории:
    <div class="flex gap-3 flex-row-reverse">
      <router-link :to="`/admin/store/category/${category.id}`" class="bg-background-secondary rounded-2xl px-3 py-2" v-for="category in infoStore.categories">
        <p>id: {{category.id}}</p>
        <p>Имя категории: {{category.name}}</p>
        <p>Описание категории: {{category.description}}</p>
      </router-link>
    </div>
  </template>
  <template v-else>
    Нет категорий
  </template>
  <div class="flex gap-3">
    <div class="btn__createCategory" type="button" @click="openModalCreate(false)">
      Создать категорию
    </div>
    <div class="btn__createCategory" type="button" @click="openModalCreate(true)">
      Изменить магазин
    </div>
    <div class="btn__createCategory" type="button" @click="deleteStore()">
      Удалить магазин
    </div>
  </div>
</div>
  <div
      id="static-modal"
      data-modal-backdrop="static"

      aria-hidden="true"
      :class="{'hidden': !modalCreate, 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50': modalCreate}"
  >

      <template v-if="!changeModalContent">
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
          <h2 class="text-3xl font-semibold mb-4 ">Создать категорию в магазине по адресу: {{infoStore.address}}</h2>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700">Название категории</label>
            <input type="text" id="address" v-model="nameCategory" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите название категории"/>
          </div>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700">Описание категории</label>
            <input type="text" id="address" v-model="descriptionCategory" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите описание категории"/>
          </div>
          <button @click="createCategory" class="btnLogIn w-full justify-center">
            <p class="btn__createCategory">Создать категорию</p>
          </button>
          <div @click="closeModalCreate" type="button" class="cursor-pointer">
            <img class="closeModal" src="../../../assets/icons/closeWhite.svg" alt="">
          </div>
        </div>
      </template>
      <template v-else>

        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
          <h2 class="text-3xl font-semibold mb-4 ">Изменить магазин</h2>
          <div class="mb-4">
            <label for="address" class="block text-sm font-medium text-gray-700">Адрес</label>
            <input type="text" id="address" v-model="storeAddress" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите адрес"/>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Время работы</label>
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="startTime" class="block text-sm">Начало</label>
                <input type="time" id="startTime" v-model="startWorkingHours" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"/>
              </div>
              <div class="flex-1">
                <label for="endTime" class="block text-sm">Конец</label>
                <input type="time" id="endTime" v-model="endWorkingHours" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"/>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Время доставки</label>
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="startTime" class="block text-sm">Начало</label>
                <input type="time" id="startTime" v-model="startDeliveryTime" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"/>
              </div>
              <div class="flex-1">
                <label for="endTime" class="block text-sm">Конец</label>
                <input type="time" id="endTime" v-model="endDeliveryTime" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"/>
              </div>
            </div>
          </div>
          <PhoneNumber v-model="storePhoneNumber"/>
          <button @click="updateStore" class="btnLogIn w-full justify-center">
            <p class="btn__createCategory">Изменить</p>
          </button>

          <div @click="closeModalCreate" type="button" class="cursor-pointer">
            <img class="closeModal" src="@/assets/icons/closeWhite.svg" alt="">
          </div>
        </div>
      </template>
    </div>
</template>

<script setup>
import {CreateCategory, DeleteStore, GetStoreById, UpdateStore} from "~/server/responsesAPI.js";
import { useRoute, useRouter } from 'vue-router';
import {ref} from "vue";
import PhoneNumber from "~/components/PhoneNumber.vue";

const route = useRoute();
const router = useRouter();
const storeId = route.params.id;

const infoStore = ref('');
const nameCategory = ref('')
const descriptionCategory = ref('')
const isLoading = ref(false);
const modalCreate = ref(false);
const changeModalContent = ref(false);
const error = ref('')

const storeAddress = ref(null);
const startWorkingHours = ref(null);
const endWorkingHours = ref(null);
const startDeliveryTime = ref(null);
const endDeliveryTime = ref(null);
const storePhoneNumber = ref(null);

const getThisStore = async () =>{
  const res = await GetStoreById(storeId);
  storeAddress.value = res.store.address
  startWorkingHours.value = res.store.startWorkingHours
  endWorkingHours.value = res.store.endWorkingHours
  startDeliveryTime.value = res.store.startDeliveryTime
  endDeliveryTime.value = res.store.endDeliveryTime
  infoStore.value = res.store;
}
const openModalCreate = (change) => {
  changeModalContent.value = change;
  modalCreate.value = true;
};

const closeModalCreate = () => {
  modalCreate.value = false;
};

const createCategory = async () =>{
  const res = await CreateCategory(storeId, nameCategory.value, descriptionCategory.value)
  await getThisStore(storeId);
  if (res.result) {
    closeModalCreate()
  }else error.value = 'Ошибка сервера'
}

const updateStore = async () =>{
  const res = await UpdateStore(
      storeId,
      storeAddress.value,
      startWorkingHours.value,
      endWorkingHours.value,
      startDeliveryTime.value,
      endDeliveryTime.value,
      storePhoneNumber.value,
  );
  await getThisStore(storeId);
  if (res.result) {
    closeModalCreate()
  }else error.value = 'Измените данные илишибка сервера'
}
const deleteStore = async () =>{
  let confirmDelete = confirm(`Вы точно хотите удалить магазин по адресу ${storeAddress.value}? Категории и продукты удаляться тоже.`);
  if (confirmDelete ) {
    const res = await DeleteStore(storeId)
    if (res.result){
      await router.push('/admin/store');
    }
  }
}
onMounted(async ()=>{
  await getThisStore(storeId);

  isLoading.value = true
})
</script>

<style scoped lang="scss">
@use "@/assets/style/mixins" as *;
.btn{
  &__createStore{

  }
}
.closeModal{
  @apply absolute top-1 -right-10;
}
.btn{
  &__createCategory{
    @include btn-border;
    @apply py-2 px-3;
  }
}
</style>