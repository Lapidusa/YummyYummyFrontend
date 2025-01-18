<template>
  <div class="sidebar">
    <div class="sidebar__top">
      <NuxtLink class="btnHome" to="/">
        <img src="../assets/logo.svg" alt="logo">
      </NuxtLink>
      <div class="sidebar__list">
        <NuxtLink class="btnAdmin" to="/admin/main">
          <img class="" src="../assets/icons/dashboard.svg" alt="Дашборд"/>
          Главная
        </NuxtLink>
        <NuxtLink class="btnAdmin" to="/admin/store">
          <img class="" src="../assets/icons/store.svg" alt="Магазины"/>
          Магазины
        </NuxtLink>
        <NuxtLink class="btnAdmin" to="/admin/orders">
          <img class="" src="../assets/icons/orders.svg" alt="Заказы"/>
          Заказы
        </NuxtLink>
        <NuxtLink class="btnAdmin" to="/admin/history">
          <img class="" src="../assets/icons/history.svg" alt="История"/>
          История
        </NuxtLink>
      </div>
    </div>
    <div class="sidebar__bottom">
      <NuxtLink class="btnProfile" to="/admin/profile">
        <img class="" src="../assets/icons/profile.svg" alt="История"/>
        Профиль
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.sidebar{
@apply bg-white w-min flex h-full flex-col justify-between;
  &__top{
    @apply flex flex-col w-min gap-10 items-center;
  }
  &__logo{
    width: 40px;
    height: 40px;
  }
}
.btn{
  &Admin{
    @apply flex flex-col gap-1 items-center text-sm py-2 px-3
    hover:bg-background-dark-light;

    & img{
      width: 25px;
      height: 25px;
    }
  }
  &Home{
    @apply flex justify-center;
    & img{
      width: 50px;
      height: 50px;
    }
  }
  &Profile{
    @apply flex flex-col gap-1 items-center text-sm py-2 px-3
    hover:bg-background-dark-light;
    & img{
      width: 20px;
      height: 20px;
    }
  }
}
</style>