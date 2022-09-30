<script setup>
import { onMounted, reactive, ref } from "vue";
import OneDayInfo from "@/components/OneDayInfo.vue";
import MultiDayInfo from "@/components/MultiDayInfo.vue";

import stomach from "@/assets/stomach.svg";
import lessrice from "@/assets/less_rice.svg";
import chat from "@/assets/chat.svg";
import takeaway from "@/assets/takeaway.svg";
// import mockList from "@/assets/summary_list.json";

import { get } from "@/request";

const dailyData = reactive({});
const monthlyData = reactive({});
const isLoaded = ref(false);

let currPage = ref(0);
setInterval(() => {
  currPage.value = (currPage.value + 1) % 2;
}, 10000);

onMounted(async () => {
  let dailyRes = await get("poster/getDaily", null);
  dailyData.value = dailyRes;
  let monthlyRes = await get("poster/getMonthly", null);
  monthlyData.value = monthlyRes;
  console.log(monthlyData.value)
  isLoaded.value = true;
});
</script>

<template>
  <div>
    <div class="bg" v-if="isLoaded">
      <div class="header">
        <span>How much FOOD we WASTED @ LG1?</span>
        <span>{{ dailyData.value.date }}</span>
      </div>
      <div class="main">
        <one-day-info
          class="main-content"
          v-if="currPage === 0"
          :dailyData="dailyData.value"
        />
        <multi-day-info
          class="main-content"
          v-if="currPage === 1"
          :monthlyData="monthlyData.value"
        />
      </div>
      <div class="footer">
        <div
          style="
            width: 100%;
            margin: auto;
            height: 0.5vh;
            background: #a81e2d;
            margin: 1vh 0;
          "
        />
        <div class="footer-title">
          What you can do to help reduce our campus’s food waste:
        </div>
        <div class="footer-content">
          <div class="advice">
            <stomach />
            <div>consider your appetite before ordering</div>
          </div>
          <div class="advice">
            <lessrice />
            <div>choose the “less rice” option</div>
          </div>
          <div class="advice">
            <chat />
            <div>kindly ask the staff to give you less food</div>
          </div>
          <div class="advice">
            <takeaway />
            <div>bring a lunch box to pack for excess food</div>
          </div>
        </div>
        <div class="footer-contact">
          <!-- <img src="@/assets/ust_logo.svg" style="width: 2vw; margin: 0 1vw"/> -->
          <div>Food waste SSC project | contact us: xxx@ust.hk</div>
        </div>
      </div>
    </div>
    <div v-else>Food Waste FYP. loading resources...</div>
  </div>
</template>

<style scoped>
.bg {
  background: #f8e6ce;
}
.header {
  display: flex;
  justify-content: space-between;
  height: 15vh;
  line-height: 15vh;
  font-size: 8vh;
  padding: 0 2vw;
  /* box-sizing: border-box; */
  background: #a81e2d;
  color: white;
  font-family: "Neue-bold";
}
.main {
  box-sizing: border-box;
  height: 55vh;
  padding: 1vw 2vw;
}
.footer {
  height: 30vh;
  box-sizing: border-box;
  padding: 0 2vw;
}
.footer-title {
  color: #a81e2d;
  font-size: 1.5vw;
  font-family: "Neue-bold";
  margin-top: 1.5vh;
}
.footer-content {
  display: flex;
  justify-content: space-between;
  font-family: "Neue-regular";
}
.advice {
  text-align: center;
  font-size: 1.3vw;
}
.advice svg {
  height: 8vh;
  margin: 1vh;
}
.footer-contact {
  font-size: 1.3vw;
  /* line-height: 1vw; */
  font-family: "Neue-regular";
  position: absolute;
  bottom: 0;
  right: 2vw;
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    /* transform: translate3d(-100%, 0, 0); */
  }

  to {
    opacity: 1;
    transform: none;
  }
}
.main-content {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: fadeInLeft;
}
</style>
