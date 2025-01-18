<template>
  <header class="header">
    <div class="header__logo">
      <Logo></Logo>
    </div>
    <div class="header__stores">
      <Stores></Stores>
    </div>
    <div class="header__search">
      <Search></Search>
    </div>
    <div class="header__btns d-flex gap-3">
      <div class="header__btns-logIn">
        <LogIn></LogIn>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import LogIn from './LogIn.vue'
import Search from './Search.vue'
</script>

<style scoped lang="scss">
.header{
  display: flex;
  gap: 20px;
  background: var(--light);

  &__logo{
    width: fit-content;
    flex-shrink: 0;
  }

  &__search{
    width: 100%;
  }

  &__logIn{
    width: fit-content;
  }
  .header__btns{
    display: flex;
    gap: 15px;
  }
}
</style>