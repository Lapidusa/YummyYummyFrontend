<template>
  <div v-if="isLoading" class="text-3xl flex justify-center items-center h-full">
    <p>Loading...</p>
  </div>
  <div v-else>
    <div class="flex gap-4">
      <img :src="thisProduct.imageUrl" alt="" width="220"/>
      <div class="">
        <p><b>Id:</b> {{ thisProduct.id }}</p>
        <p><b>Название:</b> {{ thisProduct.name }}</p>
        <p><b>Описание:</b> {{ thisProduct.description }}</p>
        <p><b>Пицца:</b> {{ thisProduct.isPizza ? 'Да' : 'Нет' }}</p>
        <div class="flex gap-2">
          <button class="btn" @click="openModal">Изменить продукт</button>
          <button class="btn" @click="deleteProduct">Удалить продукт</button>
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
      <div class="bg-white rounded-lg shadow-lg p-6 z-50 relative">
        <h2 class="text-3xl font-semibold mb-4">Изменить продукт</h2>

        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Название продукта</label>
          <input type="text" id="name" v-model="nameProduct" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите название продукта"/>
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Описание продукта</label>
          <textarea type="text" id="description" v-model="descriptionProduct" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите описание продукта"/>
        </div>

        <div class="mb-4">
          <label for="discount" class="block text-sm font-medium text-gray-700">Скидка продукта</label>
          <input type="number" id="discount" v-model="discountProduct" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50" placeholder="Введите скидку продукта (от 0 до 1), если ее нет, введите 0"/>
        </div>

        <input type="file" id="file" ref="fileInput" accept="image/png, image/jpeg"/>
        <div class="my-4">
          <label>
            <input type="checkbox" v-model="isPizza"/> Это пицца?
          </label>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold">Ингредиенты</h3>
          <div v-if="isPizza">
            <div v-for="(ingredient, index) in ingredients" :key="index" class="flex items-center mb-2">
              <input type="text" v-model="ingredient.name" placeholder="Имя ингредиента" class="border border-gray-300 rounded-md p-1 mr-2 w-full"/>
              <input type="checkbox" v-model="ingredient.canRemove" class="btn"/> <p>Можно удалить</p>
              <button @click="removeIngredient(index)" class="btn">Удалить</button>
            </div>
            <button @click="addIngredient" class="btnLogIn w-full justify-center">
              <p class="btn">Добавить ингредиент</p>
            </button>
          </div>
          <div v-else>
            <p>Ингредиенты не требуются для обычного продукта.</p>
          </div>
        </div>


        <div v-if="isPizza" class="mb-4">
          <h3 class="text-lg font-semibold">Варианты пиццы</h3>
          <div v-for="(variant, index) in pizzaVariants" :key="index" class="flex  mb-2">
              <div class="flex flex-col justify-center">
                <label for="sizeS" class="text-sm">S</label>
                <input type="radio" id="sizeS" value="0" v-model="variant.size" class="mr-2" />
              </div>
              <div class="flex flex-col justify-center">
                <label for="sizeM" class="text-sm">M</label>
                <input type="radio" id="sizeM" value="1" v-model="variant.size" class="mr-2" />
              </div>
              <div class="flex flex-col justify-center">
                <label for="sizeL" class="text-sm">L</label>
                <input type="radio" id="sizeL" value="2" v-model="variant.size" class="mr-2" />
              </div>
            <div class="flex flex-col justify-center">
              <label for="price" class="block text-sm font-medium text-gray-700">Цена</label>
              <input type="number" id="price" v-model="variant.price" placeholder="Цена" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="energyValue" class="block text-sm font-medium text-gray-700">Энергетическая ценность</label>
              <input type="number" id="energyValue" v-model="variant.energyValue" placeholder="Энергетическая ценность" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="proteins" class="block text-sm font-medium text-gray-700">Белки</label>
              <input type="number" id="proteins" v-model="variant.proteins" placeholder="Белки" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="fats" class="block text-sm font-medium text-gray-700">Жиры</label>
              <input type="number" id="fats" v-model="variant.fats" placeholder="Жиры" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="carbohydrates" class="block text-sm font-medium text-gray-700">Углеводы</label>
              <input type="number" id="carbohydrates" v-model="variant.carbohydrates" placeholder="Углеводы" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="weight" class="block text-sm font-medium text-gray-700">Вес</label>
              <input type="number" id="weight" v-model="variant.weight" placeholder="Вес" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>
            <button @click="removePizzaVariant(index)" class="btn">Удалить вариант</button>
          </div>
          <button @click="addPizzaVariant" class="btnLogIn w-full justify-center">
            <p class="btn">Добавить вариант пиццы</p>
          </button>
        </div>

        <div v-else>
          <h3 class="text-lg font-semibold">Варианты продукта</h3>
          <div v-for="(variant, index) in productVariants" :key="index" class="flex mb-2">
            <div class="flex flex-col justify-center">
              <label for="variantName" class="block text-sm font-medium text-gray-700">Название варианта</label>
              <input type="text" id="variantName" v-model="variant.name" placeholder="Например, 3шт или 150млф" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="price" class="block text-sm font-medium text-gray-700">Цена</label>
              <input type="number" id="price" v-model="variant.price" placeholder="Цена" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="energyValue" class="block text-sm font-medium text-gray-700">Энергетическая ценность</label>
              <input type="number" id="energyValue" v-model="variant.energyValue" placeholder="Энергетическая ценность" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="proteins" class="block text-sm font-medium text-gray-700">Белки</label>
              <input type="number" id="proteins" v-model="variant.proteins" placeholder="Белки" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="fats" class="block text-sm font-medium text-gray-700">Жиры</label>
              <input type="number" id="fats" v-model="variant.fats" placeholder="Жиры" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="carbohydrates" class="block text-sm font-medium text-gray-700">Углеводы</label>
              <input type="number" id="carbohydrates" v-model="variant.carbohydrates" placeholder="Углеводы" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>

            <div class="flex flex-col justify-center">
              <label for="weight" class="block text-sm font-medium text-gray-700">Вес</label>
              <input type="number" id="weight" v-model="variant.weight" placeholder="Вес" class="border border-gray-300 rounded-md p-1 mb-1"/>
            </div>
            <button @click="removeProductVariant(index)" class="btn">Удалить вариант</button>
          </div>
          <button @click="addProductVariant" class="btnLogIn w-full justify-center">
            <p class="btn mb-4">Добавить вариант продукта</p>
          </button>
        </div>

        <button @click="updateProduct" class="btnLogIn w-full justify-center">
          <p class="btn">Изменить</p>
        </button>
        <div @click="closeModal" type="button" class="cursor-pointer">
          <img class="closeModal" src="@/assets/icons/closeWhite.svg" alt=""/>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {CreateProduct, DeleteCategory, DeleteProduct, GetProduct} from "~/server/responsesAPI.js";
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const productId = route.params.id;

const isLoading = ref(true);
const thisProduct = ref(null);
const viewModal = ref(false);
const changeModalContent = ref(false);
const fileInput = ref(null);
const nameProduct = ref('');
const descriptionProduct = ref('');
const discountProduct = ref(0);
const ingredients = reactive([]);
const pizzaVariants = reactive([]);
const productVariants = reactive([]);
const isPizza = ref(false);

const getProduct = async () => {
  try {
    const res = await GetProduct(productId);
    if (res && res.product) {
      thisProduct.value = res.product;
      nameProduct.value = thisProduct.value.name
      descriptionProduct.value = thisProduct.value.description
      discountProduct.value = thisProduct.value.discount
      isPizza.value = thisProduct.value.isPizza
      pizzaVariants.splice(0, pizzaVariants.length, ...thisProduct.value.pizzaVariants);// Присваиваем полученные данные
      productVariants.splice(0, productVariants.length, ...thisProduct.value.productVariants);// Присваиваем полученные данные
      ingredients.splice(0, ingredients.length, ...thisProduct.value.ingredients);
    } else {
      console.error('Category not found in response:', res);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
  } finally {
    isLoading.value = false;
  }
}
const openModal = () => {
  viewModal.value = true;
};

const closeModal = () => {
  viewModal.value = false;
};

const addIngredient = () => {
  ingredients.push({ name: '', canRemove: false });
};

const removeIngredient = (index) => {
  ingredients.splice(index, 1);
};

const addPizzaVariant = () => {
  pizzaVariants.push({ size: '', doughType: '', price: 0, energyValue: 0, proteins: 0, fats: 0, carbohydrates: 0, weight: 0 });
};

const removePizzaVariant = (index) => {
  pizzaVariants.splice(index, 1);
};

const addProductVariant = () => {
  productVariants.push({ name: '', price: 0, energyValue: 0, proteins: 0, fats: 0, carbohydrates: 0, weight: 0 });
};

const removeProductVariant = (index) => {
  productVariants.splice(index, 1);
};
const updateProduct = async () =>{
  const formData = new FormData();
  formData.append('Discount', discountProduct.value);
  formData.append('Name', nameProduct.value);
  formData.append('Description', descriptionProduct.value);
  formData.append('CategoryId', categoryId);

  if (fileInput.value.files.length > 0) {
    formData.append('ImageFile', fileInput.value.files[0]);
  }
  formData.append('IsPizza', isPizza.value);

  ingredients.forEach((ingredient, index) => {
    formData.append(`Ingredients[${index}].Name`, ingredient.name);
    formData.append(`Ingredients[${index}].CanRemove`, ingredient.canRemove);
  });

  if (isPizza.value) {
    pizzaVariants.forEach((variant, index) => {
      formData.append(`PizzaVariants[${index}].Size`, variant.size);
      formData.append(`PizzaVariants[${index}].Price`, variant.price);
      formData.append(`PizzaVariants[${index}].EnergyValue`, variant.energyValue);
      formData.append(`PizzaVariants[${index}].Proteins`, variant.proteins);
      formData.append(`PizzaVariants[${index}].Fats`, variant.fats);
      formData.append(`PizzaVariants[${index}].Carbohydrates`, variant.carbohydrates);
      formData.append(`PizzaVariants[${index}].Weight`, variant.weight);
    });
  }else {
    // Добавляем варианты для обычного продукта
    productVariants.forEach((variant, index) => {
      formData.append(`ProductVariant[${index}].Name`, variant.name);
      formData.append(`ProductVariant[${index}].Price`, variant.price);
      formData.append(`ProductVariant[${index}].EnergyValue`, variant.energyValue);
      formData.append(`ProductVariant[${index}].Proteins`, variant.proteins);
      formData.append(`ProductVariant[${index}].Fats`, variant.fats);
      formData.append(`ProductVariant[${index}].Carbohydrates`, variant.carbohydrates);
      formData.append(`ProductVariant[${index}].Weight`, variant.weight);
    });
  }
  const res = await UpdateProduct(formData);
  if (res.result){
    await router.go(-1);
  }
}
const deleteProduct = async () =>{
  let confirmDelete = confirm(`Вы точно хотите удалить продукт ${thisProduct.value.name}?`);
  if (confirmDelete ) {
    const res = await DeleteProduct(productId)
    if (res.result){
      await router.go(-1);
    }
  }
}

onMounted(async () => {
  await getProduct();
});
</script>

<style scoped lang="scss">
@use "@/assets/style/mixins" as *;
.btn{
  @include btn-border;
  @apply py-2 px-3;
}
.closeModal{
  @apply absolute top-1 -right-10;
}
</style>