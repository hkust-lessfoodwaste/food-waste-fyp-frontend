<script setup>
import * as d3 from "d3";
import { onMounted, ref } from "vue";
import bowl from "@/assets/bowl.svg";

const props = defineProps({
  monthlyData: Object,
});
const {
  trend,
  currRatioMean,
  prevRatioMean,
  recordRatioLow,
  recordRatioHigh,
} = props.monthlyData;
const trendList = [...trend].reverse();
onMounted(() => {
  initBarChart();
});
const highWasteColor = "#78151F";
const mediumWasteColor = "#D46A76";
const lowWasteColor = "#c9c9c9";
const width = (window.innerWidth / 10) * 7.5,
  height = (window.innerHeight / 10) * 4,
  marginLeft = (window.innerWidth / 10) * 0.5,
  marginTop = (window.innerWidth / 10) * 0.25;
const ratioData = trendList.map((ele) => ele.wasteRatio);
const xLabelList = trendList.map((ele) => ele.date);
const groupData = trendList.map((ele, idx) => {
  let dailyData = {};
  Object.keys(ele["levelPercentage"]).forEach((level) => {
    dailyData[level] = ele["levelPercentage"][level] * ratioData[idx];
  });
  return dailyData;
});
const maxVal = Math.max(...ratioData);
const subgroups = Object.keys(groupData[0]);
const groups = groupData.map((ele, idx) => idx); // x axis
const stackedData = d3.stack().keys(subgroups)(groupData);
const color = d3
  .scaleOrdinal()
  .domain(subgroups)
  .range([highWasteColor, mediumWasteColor, lowWasteColor]);

const initBarChart = () => {
  d3.select("#bar-chart").selectAll("svg").remove();
  var svg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", width + marginLeft * 2)
    .attr("height", height + marginTop * 2)
    .append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

  // Add X axis
  var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
  var y = d3
    .scaleLinear()
    .domain([0, Math.min(recordRatioHigh, maxVal * 1.5)]) // 暂时加一个maxVal * 1.5对限制，以免历史极值过高使比例尺失调
    .range([height, 0]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat((d, i) => xLabelList[i].slice(5)));

  // Add Y axis
  svg
    .append("g")
    .call(d3.axisLeft(y).tickFormat((d, i) => (d * 100).toFixed(0) + "%"));

  svg
    .append("g")
    .selectAll("g")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    .data((d) => d)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return x(i);
    })
    .attr("y", function () {
      return y(0);
    })
    .attr("height", 0)
    .transition()
    .duration(1000)
    .attr("x", function (d, i) {
      return x(i);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d, i) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());

  setTimeout(() => {}, 1000);

  svg
    .append("g")
    .attr("transform", "translate(0, " + y(prevRatioMean) + ")")
    .append("line")
    .attr("x2", 0)
    .transition()
    .delay(800)
    .duration(1000)
    .attr("x2", width)
    .style("stroke", "gray")
    .style("stroke-width", "2px")
    .style("stroke-dasharray", "4");

  svg
    .append("g")
    .attr("transform", "translate(0, " + y(currRatioMean) + ")")
    .append("line")
    .attr("x2", 0)
    .transition()
    .delay(1500)
    .duration(1500)
    .attr("x2", width)
    .style("stroke", "gray")
    .style("stroke-width", "2px");
};
</script>

<template>
  <div>
    <div class="header">
      <div class="title">
        Food waste percentage per capita of this month ({{
          trendList[0].date
        }}
        ~ {{ trendList[trendList.length - 1].date }})
      </div>
    </div>

    <div style="display: flex">
      <div id="bar-chart"></div>
      <div class="legend">
        <div class="icon-outer">
          <div class="box" :style="'background-color:' + highWasteColor" />
          <div class="legend-title">severe waste</div>
        </div>
        <div class="icon-outer">
          <div class="box" :style="'background-color:' + mediumWasteColor" />
          <div class="legend-title">medium waste</div>
        </div>
        <div class="icon-outer">
          <div class="box" :style="'background-color:' + lowWasteColor" />
          <div class="legend-title">light/no waste</div>
        </div>
        <div class="icon-outer">
          <hr class="dashedline" />
          <div class="legend-title">last month's average</div>
        </div>
        <div class="icon-outer">
          <hr class="line" />
          <div class="legend-title">this month's average</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  width: 100%;
}
.title {
  font-size: 2vw;
  font-family: "Neue-bold";
}
.legend {
  width: 10vw;
  display: flex;
  flex-direction: column;
  align-self: center;
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
  justify-content: space-between;
  margin: 0.5vw 0;
}
.legend .icon-outer .box {
  width: 2vw;
  height: 2vw;
}
.legend .icon-outer .dashedline {
  border-top: 3px dashed gray;
  width: 2vw;
  margin-left: 0;
  margin-right: 0;
}
.legend .icon-outer .line {
  /* border: 1px solid gray; */
  background: gray;
  width: 2vw;
  margin-left: 0;
  margin-right: 0;
}
.legend .icon-outer .legend-title {
  align-self: center;
  font-family: "Neue-bold";
}
</style>
