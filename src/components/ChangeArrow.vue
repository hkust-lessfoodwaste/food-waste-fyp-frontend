<script setup>
import { onMounted, ref } from "vue";
import arrow from "@/assets/arrow.svg";
const props = defineProps({
  change: Number,
});
const barDOM = ref();
onMounted(() => {});
</script>
<template>
  <div class="arrow-out">
    <div :style="'transform-origin: center; transform: rotate(' + (change < 0 ? 0 : 180) + 'deg)'">
      <arrow :fill="change < 0 ? '#59AA33' : '#FF0000'"/>
    </div>
    <div :style="'color:' + (change < 0 ? '#59AA33' : '#FF0000')">
      {{ change }}%
    </div>
  </div>
</template>
<style scoped>
.arrow-out {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  line-height: 1.5rem;
  align-self: flex-end;
  margin-bottom: 0.5rem;
}
.arrow-out svg {
  height: 1.5rem;
  width: 1.5rem;
  animation: move 2s infinite;
}
@keyframes move {
  0% {
    transform: translate(0px, 0px);
  }
  50% {
    transform: translate(0px, 15px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}
</style>