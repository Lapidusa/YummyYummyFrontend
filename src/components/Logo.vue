<template>
  <a class="logo">
    <div class="logo-container">
      <div class="logo-container__image">
        <img src="../../public/logo.svg" alt="logo">
      </div>
      <div class="logo-container__text">
        <div class="logo-container__text-title">
          YummyYummy
        </div>
        <div class="logo-container__text-discription">
          вкусней уже некуда
        </div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">

</script>
<style scoped lang="scss">

.logo{

  .logo-container{
    display: flex;
    align-items: center;
    gap: 5px;

    &__image img{
      width: 40px;
      height: 40px;
    }

    &__text{

      &-title{
        font-size: 24px;
        color: var(--dark);
        font-weight: 1000;
        letter-spacing: 0.24px;
      }

      &-discription{
        margin-top: -4px;
        color: var(--font-secondary-alt);
      }
    }
  }
}
</style>