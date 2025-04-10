<template>
  <hr class="w-full bg-background-secondary mt-10" style="height: 1px;">
  <div class="flex justify-between mt-5">
    <div class="flex gap-5 mb-5">
      <div v-for="category in activeStore.categories" :key="category.id">
        <a href="#" class="font-medium text-2xl capitalize-first-letter hover:text-main-contrast">{{category.name}}</a>
      </div>
    </div>
    <Basket></Basket>
  </div>
  <div v-for="category in activeStore.categories" :key="category.id">
    <p class="text-3xl">{{category.name}}</p>
    <div class="grid grid-cols-4 gap-4">
      <div :id="product.id" v-for="product in category.products" :key="product.id" @click="openModal(product)">
        <img :src="product.imageUrl" alt="" width="220"/>
        <p class="font-medium text-xl">{{product.name}}</p>
        <span class="text-gray-500" >{{formatIngredients(product.ingredients)}}</span>
        <div class="flex justify-between">
          <p class="font-medium text-xl" v-if="product.pizzaVariants.length !== 0">
            от <b>{{product.pizzaVariants[0].price}} ₽ </b>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div
      id="static-modal"
      data-modal-backdrop="static"
      aria-hidden="true"
      :class="{'hidden': !viewModal, 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50': viewModal}"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 z-50 relative flex" style="width:900px">
      <img :src="productActive.imageUrl" alt="" width="450"/>
      <div class="flex flex-col w-full">
        <p class="font-bold text-3xl">{{productActive.name}}</p>
        <p v-if="productActive.isPizza" class="text-gray-500" >{{formatIngredients(productActive.ingredients)}}</p>

        <p v-if="!productActive.isPizza" class="font-medium">{{productActive.description}}</p>
        <div v-if="productActive.isPizza" class="flex flex-col gap-3 py-2">
          <div class="selectSize ">
            <input type="radio" id="sizeSmall" :value="0" v-model="selectedSize" @change="changeSize('small', productActive.pizzaVariants[0])" hidden>
            <label for="sizeSmall" :class="size.isSmall">25см</label>

            <input type="radio" id="sizeMedium" :value="1" v-model="selectedSize" @change="changeSize('medium', productActive.pizzaVariants[1])" hidden>
            <label for="sizeMedium" :class="size.isMedium">30см</label>

            <input type="radio" id="sizeLarge" :value="2" v-model="selectedSize" @change="changeSize('large', productActive.pizzaVariants[2])" hidden>
            <label for="sizeLarge" :class="size.isLarge">35см</label>
          </div>
          <div class="selectDough">
            <input type="radio" id="doughTraditional" :value="true" v-model="selectedDough" @change="changeDough('traditional', productActive.pizzaVariants[0])" hidden>
            <label for="doughTraditional" :class="dough.isTraditional">Традиционное</label>

            <input type="radio" id="doughThin" :value="false" v-model="selectedDough" @change="changeDough('thin', productActive.pizzaVariants[1])" hidden>
            <label for="doughThin" :class="dough.isThin">Тонкое</label>
          </div>
        </div>

        <button @click="addToCart(productActive, selectedSize, selectedDough)" class="add">В корзину за {{actualPrice}}р</button>
        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="@/assets/icons/closeWhite.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {basketStore, storesStore} from "~/server/pinia.js";
import {onMounted, ref} from "vue";
import Basket from "~/components/Basket.vue";

const storeBasket = basketStore();
const store = storesStore();
const activeStore = computed(()=> store.store);
const viewModal = ref(false);
const productActive = ref({});
const actualPrice = ref(null);
const search = ref(null);
const isSmall = ref(false);
const isMedium = ref(true);
const isLarge = ref(false);
const isTraditional = ref(true);
const isThin = ref(false);
const selectedSize = ref(1);
const selectedDough = ref(true);

const size = reactive({
  isSmall: "sizeS",
  isMedium: "sizeM active",
  isLarge: "sizeL",
});

const dough = reactive({
  isTraditional: "doughTraditional active",
  isThin:"doughThin"
})
const openModal = (product) => {
  productActive.value = product;
  if (search.value.length > 0) {
    search.value[0].style.zIndex = '0';
  }
  viewModal.value = true;

  actualPrice.value = product.pizzaVariants.length !==0 ? product.pizzaVariants[1].price : product.variants[1].price
};

const closeModal = () => {
  viewModal.value = false;
};

const changeSize = (selectedSize, variant) => {
  isSmall.value = selectedSize === 'small';
  isMedium.value = selectedSize === 'medium';
  isLarge.value = selectedSize === 'large';

  size.isSmall = isSmall.value ? "sizeS active" : "sizeS";
  size.isMedium = isMedium.value ? "sizeM active" : "sizeM";
  size.isLarge = isLarge.value ? "sizeL active" : "sizeL";
  actualPrice.value = variant.price
};

const changeDough = (selectedDough, variant) => {
  isTraditional.value = selectedDough === 'traditional';
  isThin.value = selectedDough === 'thin';
  dough.isTraditional = isTraditional.value ? "doughTraditional active" : "doughTraditional";
  dough.isThin = isThin.value ? "doughThin active" : "doughThin";
};

const formatIngredients = (ingredients)=> {
  return ingredients
      .map(ingredient => ingredient.name.trim())
      .join(', ')
      .replace(/^(.)/, (match) => match.toUpperCase());
}

const addToCart = (product, size, dough)=>{
  const newProduct = JSON.parse(JSON.stringify(product));
  if (newProduct.isPizza){
    newProduct.pizzaVariants = newProduct.pizzaVariants.filter(variant => variant.size === size);
    newProduct.pizzaVariants[0].doughType = dough
    newProduct.quantity = 1;
  }
  storeBasket.addToBasket(newProduct);
  viewModal.value = false
}

onMounted(async () => {
  search.value = document.getElementsByClassName('search-container');
});
</script>

<style scoped lang="scss">
@use "@/assets/style/mixins" as *;

.capitalize-first-letter::first-letter {
  text-transform: uppercase;
}
.closeModal{
  @apply absolute top-1 -right-10;
}
.selectSize{
  display: grid;
  grid-template-areas: "sizeS sizeM sizeL";
  grid-template-columns: 33% 33% 33%;
  grid-template-rows: 32px;
  justify-content: space-between;
  @apply  rounded-full bg-background-secondary;
  padding: 0;
  margin: 0;
}

.selectDough{
  display: grid;
  grid-template-areas: "doughTraditional doughThin";
  grid-template-columns: 50% 50%;
  grid-template-rows: 32px;
  justify-content: space-between;
  @apply  rounded-full bg-background-secondary;
  padding: 0;
  margin: 0;
}
.sizeS,
.sizeM,
.sizeL,
.doughTraditional,
.doughThin{
  background: transparent;
  @apply text-black text-xs rounded-full;
  margin: 2px;
  display: flex; /* Enable flexbox */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  font-size: 12px;
}
.sizeS.active,
.sizeM.active,
.sizeL.active,
.doughTraditional.active,
.doughThin.active{
  margin: 2px;
  box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.04), 0 3px 8px 0 rgba(0, 0, 0, 0.12);
  border-radius: 9px;
  @apply  rounded-full bg-white;
  color: black;
  transition: 0.2s;
}
.add {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  transition: all 0.2s ease;
  @include btn;
  @apply font-semibold rounded-full;
  &:hover {
    .btnLogIn__icon {
      width: 16px;
      height: 16px;
      background: url("../assets/icons/profileHover.svg") no-repeat;
    }

    box-shadow: 0 1px 10.5px 0 rgba(0, 0, 0, 0.25);
  }
}
</style>