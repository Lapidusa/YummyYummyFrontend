<template>
<div class="stores" v-if="stores.length !== 0">
    <div class="flex gap-2">
      <router-link
          v-for="store in stores"
          :key="store.id"
          :to="`/admin/store/${store.id}`"
          class="store cursor-pointer hover:bg-background-dark-light transition hover:transform hover:-translate-y-1"
      >
        <p class="font-bold text-lg">Магазин по адресу: {{store.address}}</p>
        <p>Время работы: {{store.startWorkingHours.substring(0,5)}} - {{store.endWorkingHours.substring(0,5)}}</p>
        <p>Время работы: {{store.startDeliveryTime.substring(0,5)}} - {{store.endDeliveryTime.substring(0,5)}}</p>
        <p>Рабочий телефон: {{store.phoneNumber}}</p>
      </router-link>

    </div>
    <div class="btn__createStore" type="button" @click="openModal">
      Создать магазин
    </div>
</div>
<div v-else class="flex flex-col items-baseline">
  <p>Магазинов нет</p>
  <div class="btn__createStore" type="button" @click="openModal">
    Создать магазин
  </div>
</div>

<div
    id="static-modal"
    data-modal-backdrop="static"

    aria-hidden="true"
    :class="{'hidden': !isModalOpen, 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50': isModalOpen}"
>
  <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
    <h2 class="text-3xl font-semibold mb-4 ">Создать магазин</h2>
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
    <button @click="createStore" class="btnLogIn w-full justify-center">
      <p class="btnLogIn__text">Создать</p>
    </button>

    <div @click="closeModal" type="button" class="cursor-pointer">
      <img class="closeModal" src="../../../assets/icons/closeWhite.svg" alt="">
    </div>
  </div>
</div>
</template>

<script setup>
import {CreateStore, GetAllStores} from "~/server/responsesAPI.js";
import { useRouter } from 'vue-router';
import {ref} from "vue";
import PhoneNumber from "~/components/PhoneNumber.vue";
const router = useRouter();
const stores = ref(0);

const isModalOpen = ref(false);
const storeAddress = ref(null);
const startWorkingHours = ref(null);
const endWorkingHours = ref(null);
const startDeliveryTime = ref(null);
const endDeliveryTime = ref(null);
const storePhoneNumber = ref('');

const error = ref('');

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const GetStores = async () =>{
  const res = await GetAllStores()
  if (!res.result){
    await router.push('/')
  }
  else{
    stores.value = res.stores;
  }
}
const createStore = async () => {
  const res = await CreateStore(
      storeAddress.value,
      startWorkingHours.value,
      endWorkingHours.value,
      startDeliveryTime.value,
      endDeliveryTime.value,
      storePhoneNumber.value,
  );
  closeModal();

  await GetStores()
};
// storeAddress.value = null
// startWorkingHours.value = null
// endWorkingHours.value = null
// startDeliveryTime.value = null
// endDeliveryTime.value = null
// storePhoneNumber.value = ''

onMounted(async ()=>{
  await GetStores()
})
</script>

<style scoped lang="scss">
@use "../../../assets/style/mixins" as *;
.closeModal{
  @apply absolute top-1 -right-10;
}
.btn{
  &__createStore{
    @include btn-border;
    @apply py-2 px-3;
  }
}
.stores{
  @apply flex flex-col gap-1 items-start text-sm py-2 px-3;
}
.store{
  @apply flex flex-col gap-1 border-main-contrast rounded-2xl border border-solid py-2 px-3;
}
</style>