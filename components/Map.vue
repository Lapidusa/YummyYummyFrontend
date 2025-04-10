<template>
  <div ref="mapContainer" style="height: 100vh"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as L from 'leaflet';

// Ссылки на элементы DOM
const mapContainer = ref(null); // Контейнер для карты

// Данные
const map = ref(null); // Объект карты
const polygon = ref(null); // Полигон
const points = ref([]); // Массив точек

onMounted(() => {
  // Инициализируем карту после загрузки компонента
  initializeMap();
  addClickHandler();
});

// Методы
function initializeMap() {
  // Создаем новую карту
  map.value = L.map(mapContainer.value).setView([55.75, 37.62], 13);

  // Добавляем слой с тайлами
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);
}

function addClickHandler() {
  // Обрабатываем событие клика на карте
  map.value.on('click', (event) => {
    const latLng = event.latlng;

    if (!polygon.value) {
      // Если полигон еще не существует, создаем его
      points.value.push(latLng);
      polygon.value = L.polygon(points.value.valueOf()).addTo(map.value);
    } else {
      // Добавляем точку к существующему полигону
      points.value.push(latLng);
      polygon.value.setLatLngs(points.value.valueOf());
    }
  });
}

function closePolygon() {
  // Замыкаем фигуру
  if (polygon.value && points.value.length > 2) {
    points.value.push(points.value[0]);
    polygon.value.setLatLngs(points.value.valueOf());
    alert('Полигон замкнут!');
  }
}

// Экспортируем методы, доступные снаружи компонента
defineExpose({
  closePolygon
});
</script>

<style scoped>
#map {
  height: 500px;
}
</style>