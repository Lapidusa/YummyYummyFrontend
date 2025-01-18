<template>
  <div class="btn flex items-center cursor-pointer" @click="openBasket">
    <p class="text-lg font-bold" v-if="basketQuantity > 0"> {{ totalPrice }} ₽</p>
    <div class="vertical-line" v-if="basketQuantity > 0"></div>
    <div class="iconBasket"></div>
    <p class="font-medium text-xl ml-2" v-if="basketQuantity > 0">{{ basketQuantity }}</p>
  </div>

  <div
      id="static-modal"
      data-modal-backdrop="static"
      aria-hidden="true"
      :class="{'hidden': !viewBasket, 'fixed inset-0 flex justify-end bg-black bg-opacity-50': viewBasket}"
  >
    <div class="bg-background-secondary shadow-lg z-50 relative flex" style="width:400px; max-height: 100vh; overflow-y: auto;">
      <div v-if="basketQuantity === 0" class="bg-white p-12 flex flex-col items-center justify-center">
        <img src="@/assets/emptyBasket.png" alt="" width="120"/>
        <p class="text-3xl mt-5">Корзина пустая</p>
        <p class="text-base text-center opacity-40 mt-1.5">Добавьте хотя бы одну пиццу, чтобы совершить заказ</p>
        <button @click="closeBasket" class="btnClose font-bold flex items-center gap-2 mt-11">
          <div class="iconBackArrow"></div>
          Вернуться назад
        </button>
      </div>
      <div v-else class="flex flex-col justify-between w-full">
        <div class="flex flex-col">
          <div class="flex p-5 gap-4">
            <button @click="closeBasket">
              <div class="iconBackArrow" style="filter: invert(30%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);"></div>
            </button>
            <p class="text-xl">В корзине <b>{{basketQuantity}} {{ getProductLabel(basketQuantity) }}</b></p>
          </div>
          <div class="flex flex-col gap-5">
            <div v-for="product in basketValue" class="w-full bg-white p-5 flex gap-6 items-start">
              <img :src="product.imageUrl" alt="" width="65" height="65"/>
              <div class="flex flex-col w-full">
                <p class="font-medium text-xl">{{product.name}}</p>
                <p v-if="product.isPizza" class="font-medium text-font-secondary">{{getDescription(product)}}</p>
                <hr class="w-full bg-background-secondary my-3" style="height: 1px;">
                <div class="flex justify-between w-full items-center">
                  <div class="flex items-center gap-2.5">
                    <button @click="removeFromBasket(product)" class="btn-border p-2.5">-</button>
                    <b>{{ product.quantity }}</b>
                    <button @click="addToBasket(product)" class="btn-border p-2.5">+</button>
                  </div>
                  <p v-if="product.isPizza" class="font-bold text-lg">
                    {{product.pizzaVariants[0].price * product.quantity}} ₽
                  </p>
                  <p v-if="!product.isPizza" class="font-bold">
                    {{product.variants[0].price * product.quantity}} ₽
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col p-6 gap-6 bg-white mt-4">
          <div class="total-price flex items-end justify-between">
            <p class="text-lg">Итого:</p>
            <div class="flex-1 w-full bg-font-secondary mb-2 mx-1" style="height: 1px; border: 1px dashed #DFDFDF;"></div>
            <p class="text-lg font-bold">{{ totalPrice }} ₽</p>
          </div>
          <button @click="toOrder" class="btn flex items-center gap-2 justify-center">
            <p class="text-lg font-bold">Оформить заказ</p>
            <div class="iconBackArrow rotate-180"></div>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { basketStore } from "@/server/pinia.js";
import {AddBasket} from "~/server/responsesAPI.js";

const storeBasket = basketStore();
const viewBasket = ref(false);
const basketQuantity = ref(0);
const search = ref(null);
const totalPrice = ref(0);
const basketValue = computed(() => storeBasket.basket);

watch(basketValue, (newBasket) => {
  basketQuantity.value = newBasket.reduce((total, item) => total + item.quantity, 0);
  totalPrice.value = calculateTotalPrice(newBasket);
});

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => {
    const variants = item.isPizza ? item.pizzaVariants : item.variants;
    const priceSum = variants.reduce((sum, variant) => sum + variant.price, 0);
    return total + priceSum * item.quantity; // Учитываем количество каждого продукта
  }, 0);
};

const getProductLabel = (quantity) => {
  if (quantity % 10 === 1 && quantity % 100 !== 11) {
    return 'товар';
  } else if ((quantity % 10 >= 2 && quantity % 10 <= 4) && (quantity % 100 < 12 || quantity % 100 > 14)) {
    return 'товара';
  } else {
    return 'товаров';
  }
};

const openBasket = () => {
  viewBasket.value = true;
  if (search.value.length > 0) {
    search.value[0].style.zIndex = '0';
  }
  document.body.style.overflow = 'hidden';
};

const closeBasket = () => {
  viewBasket.value = false;
  search.value[0].style.zIndex = '10';
  document.body.style.overflow = '';
};

const addToBasket = (product) => {
  const existingProduct = storeBasket.basket.find(item => {
    if (product.isPizza) {
      return item.id === product.id && item.pizzaVariants.some(variant => variant.id === product.pizzaVariants[0].id);
    } else {
      return item.id === product.id && item.variants.some(variant => variant.id === product.variants[0].id);
    }
  });

  if (existingProduct) {
    existingProduct.quantity += 1; // Увеличиваем количество на 1
  } else {
    storeBasket.addToBasket({ ...product, quantity: 1 }); // Добавляем новый товар с количеством 1
  }

  basketQuantity.value += 1;
  totalPrice.value = calculateTotalPrice(storeBasket.basket);
  storeBasket.updateBasket(storeBasket.basket)
};

const removeFromBasket = (product) => {
  const existingProduct = storeBasket.basket.find(item => {
    if (product.isPizza) {
      return item.id === product.id && item.pizzaVariants.some(variant => variant.id === product.pizzaVariants[0].id);
    } else {
      return item.id === product.id && item.variants.some(variant => variant.id === product.variants[0].id);
    }
  });

  if (existingProduct) {
    if (existingProduct.quantity > 1) {
      existingProduct.quantity -= 1;
    } else {
      storeBasket.removeFromBasket(product.id);
    }
    basketQuantity.value -= 1;
  }

  totalPrice.value = calculateTotalPrice(storeBasket.basket);
  storeBasket.updateBasket(storeBasket.basket)
};

const getDescription = (product) => {
  if (product.pizzaVariants.length !== 0) {
    return product.pizzaVariants.map(variant => {
      let size;
      switch (variant.size) {
        case 0:
          size = "Маленькая 25 см";
          break;
        case 1:
          size = "Средняя 30 см";
          break;
        case 2:
          size = "Большая 35 см";
          break;
        default:
          size = "Неизвестный размер";
      }

      const doughType = variant.doughType ? "традиционное тесто" : "тонкое тесто";

      return `${size}, ${doughType}`;
    }).join(", ");
  }
};
const toOrder = async () =>{
  if (localStorage.getItem('token')){
    const res = await AddBasket(storeBasket.basket);
  } else{
    alert('Войдите в аккаунт!')
  }
}
onMounted(() => {
  basketQuantity.value = basketValue.value.reduce((total, item) => total + item.quantity, 0);
  search.value = document.getElementsByClassName('search-container');
  totalPrice.value = calculateTotalPrice(basketValue.value);
});
</script>

<style scoped lang="scss">
@use "../assets/style/mixins" as *;

.btn {
  @include btn;
  padding: 16px;
  position: relative;
  .iconBasket {
    background: url("@/assets/icons/cartHover.svg") no-repeat;
  }
}

.btnClose {
  @include btn;
  padding: 16px 32px;
  position: relative;
}

.iconBasket {
  width: 18px;
  height: 18px;
  object-fit: contain;
  background: url("@/assets/icons/cart.svg") no-repeat;
}

.iconBackArrow {
  width: 18px;
  height: 18px;
  object-fit: contain;
  background: url("@/assets/icons/backArrow.svg") no-repeat;
}
.vertical-line {
  background: rgba(255, 255, 255, 0.25);
  width: 2px;
  height: 24px;
  margin: 0 8px;
}
.btn-border{
  @include btn-border;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}
</style>