<!--    <NuxtRouteAnnouncer />-->
<!--    <NuxtWelcome />-->
<template>
  <div class="wrapper">
    <div class="container h-dvh" ref="container">
      <MainPage></MainPage>
    </div>
  </div>
</template>

<script setup lang="ts">
import MainPage from "~/src/pages/MainPage.vue";
import { ref, onMounted, onBeforeUnmount } from 'vue';

const parametersWrapper = ref<HTMLElement | null>(null);
const isSticky = ref(false);
const container = ref<HTMLElement | null>(null);

const handleScroll = () => {
  if (!parametersWrapper.value || !container.value) return;

  const scrollTop = window.pageYOffset;
  const parametersTop = parametersWrapper.value.offsetTop;
  const containerTop = container.value.offsetTop;

  if (scrollTop >= parametersTop && scrollTop >= containerTop && !isSticky.value) {
    console.log('Элемент parameters-wrapper стал sticky!');
    isSticky.value = true;
  }

  if (scrollTop >= parametersTop && scrollTop >= containerTop) {
    parametersWrapper.value.style.position = 'fixed';
    parametersWrapper.value.style.top = '0';
    parametersWrapper.value.style.width = '100vw';
  } else {
    parametersWrapper.value.style.position = 'static';
    parametersWrapper.value.style.top = 'auto';
    parametersWrapper.value.style.width = 'auto';
    parametersWrapper.value.style.marginLeft = '0';
    parametersWrapper.value.style.transform = 'translateX(0)';
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss">
$indent: 30px;

h1 {
  font-family: Nunito, sans-serif;
}

#__nuxt{
  @apply bg-background;
  padding: 30px 0;
  height: 100%;
}

.container{
  border-radius: 30px;
  background: #FFF;
  box-shadow: 0px 14px 20px 0px rgba(0, 0, 0, 0.05);
  padding: 30px 67px;
  max-width:calc(100% - ($indent * 2));
  position: relative;
  margin: 0 auto;
}

body, html {
  height: 100%;

  -webkit-text-size-adjust: none !important;
  -webkit-appearance: none;
}
</style>
