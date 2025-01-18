
<template>
  <div class="flex gap-2">
    <p class=" text-xl">
      Экспорт таблиц: Магазины, Категории, Продукты, Пользователи
    </p>
    <button class="btn" @click="exportTables">
      Экспорт
    </button>
  </div>
  <div class="flex gap-2">
    <p class="text-xl">
      Импорт таблиц: Магазины, Категории, Продукты, Пользователи
    </p>
    <input type="file" ref="file"  @change="onFileChange">
    <button class="btn" @click="importTables">Импорт</button>
  </div>

</template>

<script setup lang="ts">
import {ExportTables, ImportTables} from "~/server/responsesAPI";
const file = ref(null);

const exportTables = async () =>{
  await ExportTables();
}

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const importTables = async () =>{
  if (file.value) {
    const formData = new FormData();
    formData.append('file', file.value);

    try {
      const res = await ImportTables(formData);
      if (res.result) alert("Добавлено!")
    } catch (error) {
      alert("Добавьте Эксель файл!")
    }
  } else {
    console.error('No file selected');
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/style/mixins" as *;
.btn{
  @include btn-border;
  @apply py-2 px-3;
}
</style>