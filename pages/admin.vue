<template>
  <div v-if="isLoading" class="bg-background-secondary h-dvh flex">
    <SidebarAdmin></SidebarAdmin>
    <div class="container">
      <NuxtPage></NuxtPage>
    </div>
  </div>
  <div v-else>Сервер не отвечает</div>
</template>

<script setup>
import {useProfile} from "../server/responsesAPI.js"
import { useRouter } from 'vue-router';
import {ref} from "vue";
import SidebarAdmin from "~/components/SidebarAdmin.vue";
const router = useRouter();
const userStore = computed(()=>useProfile())
const isLoading = ref(false);

const validateToken = async () =>{
  const res = await userStore.value.getProfile()
  if (!res.result || res.user.role!==4){
    await router.push('/')
  }
}
onMounted(async ()=>{
  await validateToken();
  isLoading.value = true
})
</script>
<style lang="scss" scoped>
$indent: 30px;
.container{
  border-radius: 30px;
  background: #FFF;
  box-shadow: 0 14px 20px 0 rgba(0, 0, 0, 0.05);
  padding: 30px 67px;
  position: relative;
  height: calc(100vh - ($indent));

  margin: 15px;
}
</style>


<!--nameProduct-->
<!--descriptionProduct-->
<!--discountProduct-->
<!--priceProduct-->