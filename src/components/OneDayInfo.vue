<script setup>
import { onMounted, ref } from "vue";
import * as d3 from "d3";
import bowl from "@/assets/bowl.svg";
import riceicon from "@/assets/rice_icon.svg";
import meaticon from "@/assets/meat_icon.svg";
import vegeicon from "@/assets/vege_icon.svg";

const highWasteColor = "#78151F",
  mediumWasteColor = "#D46A76",
  lowWasteColor = "#c9c9c9";
const riceColor = "#F39221",
  vegeColor = "#68A885",
  meatColor = "#A81E2D";
const props = defineProps({
  dailyData: Object,
});
const { levelPercentage, typePercentage, wasteRatio } = props.dailyData;

// pic bar group
onMounted(() => {
  initPicBarChart();
});

const picbarDOM = ref();
const picbarAnimationDelayDuration = 50
const initPicBarChart = () => {
  const eleList = picbarDOM.value.querySelectorAll("svg");
  eleList.forEach((ele, idx) => {
    setTimeout(() => {
      if (idx + 1 <= levelPercentage.high * 100) {
        ele.querySelector("path").setAttribute("fill", highWasteColor);
      } else if (
        idx + 1 <=
        (levelPercentage.high + levelPercentage.medium) * 100
      ) {
        ele.querySelector("path").setAttribute("fill", mediumWasteColor);
      } else {
        ele.querySelector("path").setAttribute("fill", lowWasteColor);
      }
    }, picbarAnimationDelayDuration * idx);
  });
};

// pie group
const pieWidth = window.innerWidth / 6,
  pieHeight = window.innerHeight / 2,
  pieMargin = 0;
const pieOuterRadius = Math.min(pieWidth, pieHeight) / 2 - pieMargin;
const pieInnerRadius = pieOuterRadius / 1.5;
const pieColor = d3.scaleOrdinal().range([riceColor, vegeColor, meatColor]);
const pieAnimationArcDuration = 2000;
const pieAnimationEntryDuration = 1000;

onMounted(() => {
  initDonutChart();
});

const initDonutChart = () => {
  const svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", `translate(${pieWidth / 2},${pieHeight / 2})`);

  let generator = d3.pie().sort(null);
  let typeValueList = Object.values(typePercentage)
  let chart = generator(typeValueList);
  
  let arcs = svg
    .selectAll("path")
    .data(chart)
    .enter()
    .append("path")
    .attr("fill", (i, d) => {
      return pieColor(i);
    });

  let angleInterpolation = d3.interpolate(
    generator.startAngle()(),
    generator.endAngle()()
  );
  let innerRadiusInterpolation = d3.interpolate(0, pieInnerRadius);
  let outerRadiusInterpolation = d3.interpolate(0, pieOuterRadius);

  let arc = d3.arc();
  arcs
    .transition()
    .duration(pieAnimationArcDuration)
    .attrTween("d", (d) => {
      let originalEnd = d.endAngle;
      return (t) => {
        let currentAngle = angleInterpolation(t);
        if (currentAngle < d.startAngle) {
          return "";
        }
        d.endAngle = Math.min(currentAngle, originalEnd);
        return arc(d);
      };
    });

  d3.select("#pie-chart")
    .transition()
    .duration(pieAnimationEntryDuration)
    .tween("arcRadii", () => {
      return (t) =>
        arc
          .innerRadius(innerRadiusInterpolation(t))
          .outerRadius(outerRadiusInterpolation(t));
    });

  // legend icons
  d3.xml("src/assets/trash.svg").then((iconData) => {
    iconData.documentElement.setAttribute("width", "100");
    iconData.documentElement.setAttribute("height", "100");
    iconData.documentElement.setAttribute("x", "-50");
    iconData.documentElement.setAttribute("y", "-50");
    svg.node().append(iconData.documentElement);
  });
};
</script>

<template>
  <div style="display: flex; justify-content: space-between">
    <div style="width: 60vw">
      <div style="display: flex">
        <div class="bar-row" ref="picbarDOM">
          <div class="title">
            Distribution of food waste severity for one day
          </div>
          <div>
            <bowl v-for="i in 100" :fill="lowWasteColor" />
          </div>
        </div>
        <div class="legend">
          <div class="icon-outer">
            <bowl :fill="highWasteColor" />
            <div class="legend-title">severe waste</div>
          </div>
          <div class="icon-outer">
            <bowl :fill="mediumWasteColor" />
            <div class="legend-title">medium waste</div>
          </div>
          <div class="icon-outer">
            <bowl :fill="lowWasteColor" />
            <div class="legend-title">light/no waste</div>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 40vw">
      <div>
        <div class="title">Distribution of food waste types for a dish</div>
        <div style="display: flex">
          <div id="pie-chart"></div>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="waste-type">
              <riceicon class="icon" :fill="riceColor" />
              <div class="title">
                rice - {{ (typePercentage.rice * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="waste-type">
              <vegeicon class="icon" :fill="vegeColor" />
              <div class="title">
                vegetables -
                {{ (typePercentage.vegetables * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="waste-type">
              <meaticon class="icon" :fill="meatColor" />
              <div class="title">
                meat - {{ (typePercentage.meat * 100).toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.important-txt {
  color: #a81e2d;
}
.bar-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 45vw;
}
.bar-row svg {
  height: 4vh;
  width: 3.5vw;
  padding: 0.25vh 0.5vw;
}
.title {
  /* margin: 0.5rem; */
  font-size: 2vw;
  font-family: "Neue-bold";
  display: flex;
}
.legend {
  width: 10vw;
  display: flex;
  flex-direction: column;
  align-self: center;
  /* align-self: flex-start; */
  border: 0.2vw solid #dbdbdb;
  border-radius: 10px;
  font-size: 1vw;
  /* box-sizing: border-box; */
}
.legend svg {
  height: 4vh;
  width: 3.5vw;
  padding: 0.25vh 0.5vw;
}
.legend .icon-outer {
  display: flex;
}
.legend .icon-outer .legend-title {
  align-self: center;
  font-family: "Neue-bold";
}
.waste-type {
  display: flex;
}
.waste-type .title {
  font-size: 1.3vw;
  font-family: "Neue-bold";
  align-self: center;
}
.waste-type .icon {
  height: 10vh;
  width: 10vw;
  /* width: 10vw; */
}
</style>
