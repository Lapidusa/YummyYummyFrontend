<template>
  <div class="search">
    <div class="overlay" v-if="background"></div>

    <div class="search-container">
      <div class="search-container__icon"></div>
      <div class="" type="button" @click="openSearch">
        <input class="search-container__input" type="search" placeholder="Поиск пиццы..." v-model="searchInput">
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";

  const background = ref(false);
  const searchInput = ref('');

  const openSearch = async () => {
    background.value = !!searchInput.value;
  }

  watch(searchInput, (newValue) => {
    openSearch();
  });
</script>

<style scoped lang="scss">

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.60);
  z-index: 10;
}

.search{
  &-container{
    @apply relative z-10;

    &__icon{
      background-image: url("../../public/content/icons/search.svg");
      width: 16px;
      height: 16px;
      position: absolute;
      top: 18px;
      left: 20px;
      z-index: 1;
    }

    &__input{
      @apply relative bg-search;
      height: 50px;
      position: relative;
      border: none;
      padding: 14px 20px 14px 48px;
      width: 100% !important;
      border-radius: 15px;

      &:focus-visible{
        outline: none;
      }

      &::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
        height: 12px;
        width: 12px;
        background-image: url("../../public/content/icons/closeSearch.svg");
      }
    }
  }
}


</style>