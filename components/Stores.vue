<template v-if="isLoading">
  <div class="w-max flex flex-col justify-center">
    <p>Доставка из </p>
    <button
        @mouseenter="openDropdown"
        @mouseleave="startCloseDropdown"
        class="text-main-contrast"
    >
      <span v-if="activeStore && activeStore.address  !== null" class="">{{ activeStore.address }}</span>
    </button>
  </div>

  <div
      v-if="isDropdownOpen"
      class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow"
      @mouseenter="openDropdown"
      @mouseleave="startCloseDropdown"
  >
    <ul class="py-2 text-sm">
      <li v-for="store in stores">
        <button @click="changeStore(store.id)" class="text-start block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-main-contrast">{{store.address}}</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import {getStoresMain} from "~/server/responsesAPI.js";
  import {ref} from "vue";
  import {storesStore} from "~/server/pinia.js";

  const stores = ref(null);
  let timeoutId = null;
  const isDropdownOpen = ref(false);
  const isLoading = ref(false);
  const activeStore = ref(null);

  const storePinia = storesStore();

  const openDropdown = () => {
    clearTimeout(timeoutId);
    isDropdownOpen.value = true;
  };

  const startCloseDropdown = () => {
    timeoutId = setTimeout(() => {
      isDropdownOpen.value = false;
    }, 200);
  };

  const changeStore = (storeId) => {
    activeStore.value =stores.value.find(s => s.id === storeId);
    localStorage.setItem('store', JSON.stringify(activeStore.value.id));
    storePinia.setActiveStore(activeStore.value)
  };

  onMounted(async ()=>{
    const res = await getStoresMain();
    if(res.result){
      stores.value = res.stores || {};
      activeStore.value = stores.value[0] || {};
      localStorage.setItem('store', JSON.stringify(activeStore.value.id));
      storePinia.setActiveStore(activeStore.value)
    }
    isLoading.value = true
  })
</script>

<style scoped lang="scss">

</style>