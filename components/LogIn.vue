<template>
  <div v-if="!authorized">
    <button @click="openModal" class="btnLogIn">
      <div class="btnLogIn__icon"></div>
      <p class="btnLogIn__text">Войти</p>
    </button>
  </div>

  <div v-else class="flex gap-3 shrink-0">
    <button
        @mouseenter="openDropdown"
        @mouseleave="startCloseDropdown"
        class="btnLogIn"
    >
      <div class="btnLogIn__icon"></div>
      <p class="btnLogIn__text">Профиль</p>

    </button>

    <NuxtLink v-if="isAdmin" to="/admin/main"
        class="btnAdmin"
    >
      <div class="btnAdmin__icon"></div>
      <p class="btnLogIn__text">Админ</p>
    </NuxtLink >

  </div>
  <div
      v-if="isDropdownOpen"
      class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow"
      @mouseenter="openDropdown"
      @mouseleave="startCloseDropdown"
  >
    <ul class="mt-2.5 py-2 text-sm">
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-main-contrast">Мой профиль</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-main-contrast">Заказы</a>
      </li>
      <li>
        <a href="#" @click="LogOut" class="block px-4 py-2 hover:bg-background-dark-light dark:hover:bg-background-dark-light dark:hover:text-main-contrast">Выйти</a>
      </li>
    </ul>
  </div>
  <div
      id="static-modal"
      data-modal-backdrop="static"

      aria-hidden="true"
      :class="{'hidden': !isModalOpen, 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50': isModalOpen}"
  >
    <template v-if="!changeModal">
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
        <h2 class="text-3xl font-semibold mb-4">Вход в аккаунт</h2>
        <p class="mb-4">Введите номер телефона, чтобы войти или зарегистрироваться</p>
        <PhoneNumber v-model="userPhoneNumber"/>
        <button @click="SendCode()" class="btnLogIn w-full justify-center">
          <p class="btnLogIn__text">Получить код в SMS</p>
        </button>

        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="../assets/icons/closeWhite.svg" alt="">
        </div>
      </div>

    </template>
    <template v-else>
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
        <h2 class="text-xl font-semibold mb-4">Вход в аккаунт</h2>
        <p class="mb-4">Введите СМС-код</p>
        <div class="otp-container">
          <input type="text" maxlength="1" class="otp-input" v-model="code[0]" @input="moveFocus($event, 1)" />
          <input type="text" maxlength="1" class="otp-input" v-model="code[1]" @input="moveFocus($event, 1)" />
          <input type="text" maxlength="1" class="otp-input" v-model="code[2]" @input="moveFocus($event, 1)" />
          <input type="text" maxlength="1" class="otp-input" v-model="code[3]" @input="moveFocus($event, 1)" />
          <input type="text" maxlength="1" class="otp-input" v-model="code[4]" @input="moveFocus($event, 1)" />
          <input type="text" maxlength="1" class="otp-input" v-model="code[5]" @input="moveFocus($event, 1)" />
        </div>
        <div class="text-red" v-if="error">
          <p class="text-center py-2">Неправильный или истекший код</p>
        </div>
        <button @click="LogIn" class="btnLogIn w-full justify-center">
          <p class="btnLogIn__text">Войти</p>
        </button>
        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="../assets/icons/closeWhite.svg" alt="">
        </div>
      </div>
    </template>
  </div>

</template>

<script setup>
import {GetConfCode, Logout, useProfile, Verify} from "../server/responsesAPI.js";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PhoneNumber from "~/components/PhoneNumber.vue";

const router = useRouter();
const isModalOpen = ref(false);
const search = ref(null);
const userPhoneNumber = ref('');
const changeModal = ref(false);
const code = ref(['', '', '', '', '', '']);
const authorized = ref(false);
const isDropdownOpen = ref(false);
const error = ref(false);
const isAdmin = ref(false);
const userStore = computed(()=>useProfile())
let timeoutId = null;

const openDropdown = () => {
  clearTimeout(timeoutId);
  isDropdownOpen.value = true;
};

const startCloseDropdown = () => {
  timeoutId = setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

const openModal = () => {
  isModalOpen.value = true;
  if (search.value.length > 0) {
    search.value[0].style.zIndex = '0';
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  search.value[0].style.zIndex = '10';
};

const moveFocus = (event, direction) => {
  const current = event.target;
  if (current.value.length >= current.maxLength) {
    const next = current.nextElementSibling;
    if (next) {
      next.focus();
    }
  } else if (current.value.length === 0 && direction === -1) {
    const prev = current.previousElementSibling;
    if (prev) {
      prev.focus();
    }
  }
};

const SendCode = async () => {
  const res = await GetConfCode(userPhoneNumber.value);
  if (res.result){
    changeModal.value = true
  }
}

const LogIn = async () => {
  const verificationCode = code.value.join('');
  const res = await Verify(userPhoneNumber.value, verificationCode);

  if (res.result) {
    changeModal.value = true;
    authorized.value = true
    closeModal()

    const resUser = await userStore.value.getProfile()
    if (resUser.user.role===4){
      isAdmin.value = true
    }
  }
  else error.value = true;
};

const LogOut = async () =>{
  await Logout();
  localStorage.clear()
  authorized.value = false
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if(token){
    const resUser = await userStore.value.getProfile()
    if(resUser.result){
      authorized.value = true

      if(resUser.user.role === 4){
        isAdmin.value = true
      }
    }
  }
  search.value = document.getElementsByClassName('search-container');
});

</script>

<style scoped lang="scss">
@use "../assets/style/mixins" as *;
.btnLogIn{
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 22px;
  transition: all 0.2s ease;
  @include btn-border;
  @apply font-semibold;
  &:hover{
    .btnLogIn__icon{
      width: 16px;
      height: 16px;
      background: url("../assets/icons/profileHover.svg") no-repeat;
    }
    box-shadow: 0 1px 10.5px 0 rgba(0, 0, 0, 0.25);
  }

  &__icon{
    background: url("../assets/icons/profile.svg") no-repeat;
    width: 16px;
    height: 16px;
    transition: background 0.2s ease;
  }
}
.btnAdmin{
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 14px 22px;
  transition: all 0.2s ease;
  @include btn-border;
  @apply font-semibold;
  &:hover{
    .btnAdmin__icon{
      width: 16px;
      height: 16px;
      background: url("../assets/icons/adminHover.svg") no-repeat;
    }
    box-shadow: 0 1px 10.5px 0 rgba(0, 0, 0, 0.25);
  }

  &__icon{
    background: url("../assets/icons/admin.svg") no-repeat;
    width: 16px;
    height: 16px;
    transition: background 0.2s ease;
  }
}
.otp-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem;
}
.otp-input {
  width: 40px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
}
.otp-input:focus {
  border-color: #007bff;
}
.closeModal{
  @apply absolute top-1 -right-10;
}
#static-modal{
  z-index: 10;
}
</style>