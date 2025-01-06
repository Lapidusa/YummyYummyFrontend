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

    <NuxtLink  v-if="isAdmin" to="/admin"
        class="btnAdmin"
    >
      <div class="btnAdmin__icon"></div>
      <p class="btnLogIn__text">Админ</p>
    </NuxtLink >

  </div>
  <div
      v-if="isDropdownOpen"
      class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
      @mouseenter="openDropdown"
      @mouseleave="startCloseDropdown"
  >
    <ul class="mt-2.5 py-2 text-sm">
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-black">Dashboard</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-black">Settings</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-background-dark-light dark:hover:text-black">Earnings</a>
      </li>
      <li>
        <a href="#" @click="LogOut" class="block px-4 py-2 hover:bg-background-dark-light dark:hover:bg-background-dark-light dark:hover:text-black">Выйти</a>
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
        <h2 class="text-xl font-semibold mb-4">Вход в аккаунт</h2>
        <p class="mb-4">Введите номер телефона, чтобы войти или зарегистрироваться</p>
        <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            class="border border-gray-300 rounded-md p-2 w-full mb-4"
            v-model="phoneNumber"
            @input="mask"
            @focus="mask"
            @blur="blurHandler"
            ref="phoneInput"
        />
        <button @click="SendCode()" class="btnLogIn w-full justify-center">
          <p class="btnLogIn__text">Получить код в SMS</p>
        </button>

        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="../../public/content/icons/closeWhite.svg" alt="">
        </div>
      </div>

    </template>
    <template v-else>
      <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-50 relative">
        <h2 class="text-xl font-semibold mb-4">Вход в аккаунт</h2>
        <p class="mb-4">Введите номер телефона, чтобы войти или зарегистрироваться</p>
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
          <p class="btnLogIn__text">Получить код в SMS</p>
        </button>
        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="../../public/content/icons/closeWhite.svg" alt="">
        </div>
      </div>
    </template>
  </div>

</template>

<script setup>
import {getConfCode, Logout, useProfile, Verify} from "~/server/responsesAPI.js";
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import router from "#app/plugins/router.js";

const router = useRouter();
const isModalOpen = ref(false);
const search = ref(null);
const phoneNumber = ref('');
const formattedPhoneNumber = ref('');
const changeModal = ref(false);
const code = ref(['', '', '', '', '', '']);
const authorized = ref(false);
const isDropdownOpen = ref(false);
const error = ref(false);
const isAdmin = ref(false);
const userStore = computed(()=>useProfile())
let timeoutId = null;

const navigateToAdmin = async () => {
  await router.push('/admin');
};

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
};

const mask = (event) => {
  const input = event.target;
  const keyCode = event.keyCode;
  const pos = input.selectionStart;

  if (pos < 3) event.preventDefault();

  const matrix = "+7 (___) ___-__-__";
  let i = 0;
  const def = matrix.replace(/\D/g, "");
  const val = input.value.replace(/\D/g, "");
  let new_value = matrix.replace(/[_\d]/g, (a) => {
    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
  });

  i = new_value.indexOf("_");
  if (i !== -1) {
    i < 5 && (i = 3);
    new_value = new_value.slice(0, i);
  }

  const reg = matrix.substr(0, input.value.length).replace(/_+/g, (a) => {
    return "\\d{1," + a.length + "}";
  }).replace(/[+()]/g, "\\$&");

  const regex = new RegExp("^" + reg + "$");
  if (!regex.test(input.value) || input.value.length < 5 || (keyCode > 47 && keyCode < 58)) {
    input.value = new_value;
  }

  if (event.type === "blur" && input.value.length < 5) {
    input.value = "";
  }

  phoneNumber.value = input.value;
  formattedPhoneNumber.value = formatPhoneNumber(phoneNumber.value);
};

const formatPhoneNumber = (number) => {
  // Удаляем все символы, кроме цифр
  const cleaned = number.replace(/\D/g, '');

  // Проверяем, что номер имеет нужную длину
  if (cleaned.length === 11 && cleaned.startsWith('7')) {
    return cleaned; // Возвращаем номер в формате 71111111111
  } else if (cleaned.length === 10) {
    return '7' + cleaned; // Добавляем 7, если номер состоит из 10 цифр
  }

  return cleaned; // Возвращаем оригинальный номер, если он не соответствует формату
};
const blurHandler = (event) => {
  if (event.target.value.length < 5) {
    event.target.value = "";
    phoneNumber.value = "";
  }
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
  const res = await getConfCode(formattedPhoneNumber.value);
  if (res.result){
    changeModal.value = true
  }
}

const LogIn = async () => {
  const verificationCode = code.value.join(''); // Используйте code.value для доступа к массиву
  const res = await Verify(formattedPhoneNumber.value, verificationCode);

  if (res.result) {
    changeModal.value = true;
    const token = localStorage.setItem('token', res.token);
    authorized.value = true
    closeModal()
    if (res.user.role===0){
      isAdmin.value = true
    }
  }
  else error.value = true;
};

const LogOut = async () =>{
  localStorage.clear()
  await Logout();
  authorized.value = false
}

onMounted(async () => {
  const token = localStorage.getItem('token');
  if(token){
    const resUser = await userStore.value.getProfile()
    if(resUser){
      authorized.value = true

      if(resUser.role === 0){
        isAdmin.value = true
      }
    }
  }
  search.value = document.getElementsByClassName('search-container');
});

</script>

<style scoped lang="scss">
@import "../../public/content/style/_mixins.scss";
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
      background: url("../../public/content/icons/profileHover.svg") no-repeat;
    }
    box-shadow: 0px 1px 10.5px 0px rgba(0, 0, 0, 0.25);
  }

  &__icon{
    background: url("../../public/content/icons/profile.svg") no-repeat;
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
      background: url("../../public/content/icons/adminHover.svg") no-repeat;
    }
    box-shadow: 0px 1px 10.5px 0px rgba(0, 0, 0, 0.25);
  }

  &__icon{
    background: url("../../public/content/icons/admin.svg") no-repeat;
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
</style>