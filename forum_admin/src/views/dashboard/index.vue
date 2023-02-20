<template>
  <div class="dashboard-container">
    <div class="gender"></div>
    <div class="article"></div>
    <div class="heart"></div>
    <div class="age"></div>
    <div class="artAndTre"></div>
    <div class="tem"></div>
  </div>
</template>

<script>
import * as echarts from "echarts/core";
import {
  BarChart,
  PieChart,
  ScatterChart,
  LineChart,
  RadarChart
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  PieChart,
  ScatterChart,
  LegendComponent,
  ToolboxComponent,
  LineChart,
  RadarChart
]);
export default {
  name: "Dashboard",
  data() {
    return {
      gender: {
        title: {
          text: "用户性别比例",
          padding: [30, 0, 0, 121]
        },
        tooltip: {},
        series: [
          {
            type: "pie",
            center: ["175px", "180px"],
            data: [],
            radius: "60%"
          }
        ]
      },
      article: {
        title: {
          text: "文章类型统计",
          padding: [30, 0, 0, 190]
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "50%",
            barGap: "20%"
          }
        ]
      },
      heart: {
        title: {
          text: "七天内评论统计",
          padding: [30, 0, 0, 130]
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            type: "scatter",
            data: [220, 182, 191, 234, 290, 330, 310],
            symbolSize: 20,
            symbol:
              "path://M51.911,16.242C51.152,7.888,45.239,1.827,37.839,1.827c-4.93,0-9.444,2.653-11.984,6.905 c-2.517-4.307-6.846-6.906-11.697-6.906c-7.399,0-13.313,6.061-14.071,14.415c-0.06,0.369-0.306,2.311,0.442,5.478 c1.078,4.568,3.568,8.723,7.199,12.013l18.115,16.439l18.426-16.438c3.631-3.291,6.121-7.445,7.199-12.014 C52.216,18.553,51.97,16.611,51.911,16.242z"
          }
        ]
      },
      age: {
        title: {
          text: "用户年龄段分布",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["10-15", "15-20", "20-25", "25-30", "其他"]
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            selectedMode: "single",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      tem: {
        title: {
          text: "七天内新增用户",
          padding: [10, 0, 0, 130]
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [],
            type: "line"
          }
        ]
      },
      artAndTre: {
        title: {
          text: "待完成任务统计",
          padding: [10, 0, 0, 165]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["文章审核", "文章举报", "文章评论举报", "动态审核", "动态举报", "动态评论举报"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
            interval: 0,
            rotate: 40
          }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "任务数",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
    };
  },
  computed: {
    sevenDate() {
      var days = [];
      //当天
      var Date8 = new Date();
      //前一天
      var Date7 = this.$dayjs(
        new Date(Date8.getTime() - 24 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前两天
      var Date6 = this.$dayjs(
        new Date(Date8.getTime() - 48 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前三天
      var Date5 = this.$dayjs(
        new Date(Date8.getTime() - 72 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前四天
      var Date4 = this.$dayjs(
        new Date(Date8.getTime() - 96 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前五天
      var Date3 = this.$dayjs(
        new Date(Date8.getTime() - 120 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前六天
      var Date2 = this.$dayjs(
        new Date(Date8.getTime() - 144 * 60 * 60 * 1000)
      ).format("MM.DD");
      //前七天
      var Date1 = this.$dayjs(
        new Date(Date8.getTime() - 168 * 60 * 60 * 1000)
      ).format("MM.DD");
      days[0] = Date1;
      days[1] = Date2;
      days[2] = Date3;
      days[3] = Date4;
      days[4] = Date5;
      days[5] = Date6;
      days[6] = Date7;
      return days;
    }
  },
  methods: {
    async getUserGenderInfo() {
      const ret = await this.$API.board.getUserGenderInfo();
      if (ret.code === 200) {
        this.gender.series[0].data = ret.data;
        echarts.init(document.querySelector(".gender")).setOption(this.gender);
      }
    },
    async getTypeArticleCount() {
      const ret = await this.$API.board.getTypeArticleCount();
      if (ret.code === 200) {
        this.article.xAxis.data = ret.name;
        this.article.series[0].data = ret.value;
        echarts
          .init(document.querySelector(".article"))
          .setOption(this.article);
      }
    },
    async getWekCommentCount() {
      const ret = await this.$API.board.getWekCommentCount();
      if (ret.code === 200) {
        this.heart.series[0].data = ret.commentCountArr;
        this.heart.xAxis.data = this.sevenDate;
        echarts.init(document.querySelector(".heart")).setOption(this.heart);
      }
    },
    async getAgeInfo() {
      const ret = await this.$API.board.getAgeInfo();
      if (ret.code === 200) {
        this.age.series[0].data = ret.arr;
        echarts.init(document.querySelector(".age")).setOption(this.age);
      }
    },
    async newUserWeek() {
      const ret = await this.$API.board.newUserWeek();
      if (ret.code === 200) {
        this.tem.xAxis.data = this.sevenDate;
        this.tem.series[0].data = ret.userCountArr;
        echarts.init(document.querySelector(".tem")).setOption(this.tem);
      }
    },
    async notFinishTask() {
      const ret = await this.$API.board.notFinishTask();
      if (ret.code === 200) {
        this.artAndTre.series[0].data = ret.taskArr;
        echarts
          .init(document.querySelector(".artAndTre"))
          .setOption(this.artAndTre);
      }
    }
  },
  mounted() {
    this.getUserGenderInfo();
    this.getTypeArticleCount();
    this.getWekCommentCount();
    this.getAgeInfo();
    this.newUserWeek();
    this.notFinishTask();
  }
};
</script>

<style lang="less" scoped>
.dashboard-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .gender {
    width: 350px;
    height: 350px;
    display: inline-block;
  }
  .article {
    width: 520px;
    height: 350px;
    display: inline-block;
  }
  .heart {
    width: 400px;
    height: 350px;
    display: inline-block;
  }
  .age {
    width: 370px;
    height: 350px;
    display: inline-block;
  }
  .tem {
    width: 400px;
    height: 380px;
    display: inline-block;
    margin-top: 8px;
  }
  .artAndTre {
    width: 500px;
    height: 360px;
    display: inline-block;
  }
}
</style>
