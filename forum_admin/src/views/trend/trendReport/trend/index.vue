<template>
  <div class="app-container">
    <div class="title">待处理动态举报</div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column label="标记任务" width="140">
        <template slot-scope="scope">
          <span style="margin-right:5px;">{{statusArr[scope.$index]?'已标记':'未标记'}}</span>
          <el-switch
            ref="myTask"
            @change="changeZero(statusArr[scope.$index],scope.$index)"
            v-model="statusArr[scope.$index]"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="提交日期" width="150">
        <template slot-scope="scope">{{$dayjs(scope.row.createdAt).format("YYYY/MM/DD HH:mm")}}</template>
      </el-table-column>
      <el-table-column label="动态状态" width="150">
        <template slot-scope="scope">{{scope.row.trend.status?'已锁定':'未锁定'}}</template>
      </el-table-column>
      <el-table-column prop="bio" label="用户反馈" width="250">
        <template slot-scope="scope">
          <div class="bio-container">
            <span>{{scope.row.message}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="用户头像" width="120">
        <template slot-scope="scope">
          <img @click="showDetailUser(scope.row.user._id)" style="width: 50%;border-radius: 50%;cursor: pointer;" :src="$myBaseUrl+scope.row.user.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="user.username" label="用户昵称" width="140"></el-table-column>
      <el-table-column prop="type.content" label="违规类型" width="140"></el-table-column>
      <el-table-column class="doColumn" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="toShowDetailTrend(scope.row.trend._id)"
            style="margin-right:10px;"
            slot="reference"
            size="mini"
            type="primary"
          >去处理</el-button>
          <el-popconfirm
            @confirm="finishTrendReportTask(scope.row._id,scope.$index)"
            title="你确定要结束该任务嘛"
          >
            <el-button slot="reference" size="mini" type="success">完成</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="my-pagination"
      background
      :hide-on-single-page="true"
      layout="prev, pager, next"
      :page-size="6"
      :total="totalCount"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "trendReport",
  data() {
    return {
      tableData: [],
      model: false,
      totalCount: 0,
      statusArr: [],
      currentPage: 1
    };
  },
  watch: {
    statusArr(newVal, oldVal) {
      if (
        this.$store.state.user.trendTask &&
        this.currentPage === this.$store.state.user.trendTask.page
      ) {
        this.statusArr[this.$store.state.user.trendTask.index] = true;
      }
    }
  },
  methods: {
    showDetailUser(userId){
      this.$router.push({
        name:'UserStatus',
        params:{
          userId
        }
      })
    },
    //完成动态举报任务
    async finishTrendReportTask(val, index) {
      if (this.statusArr[index]) {
        this.$store.dispatch("user/markTrendTask", null);
      }
      const ret = await this.$API.trend.finishTrendReportTask(val);
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.currentPage -= 1;
        }
        this.getTrendReportMessage(this.currentPage);
        this.$message({
          type: "success",
          message: "该任务已完成，请再接再厉~"
        });
      }
    },
    //查看动态详情
    toShowDetailTrend(val) {
      this.$router.push({
        name: "TrendChange",
        params: {
          detailTrend: val
        }
      });
    },
    //获取动态举报任务
    async getTrendReportMessage(page) {
      let ret;
      if (page) {
        ret = await this.$API.trend.getTrendReportMessage(page);
      } else {
        ret = await this.$API.trend.getTrendReportMessage();
      }
      if (ret.code === 200) {
        let arr = [];
        for (let index = 0; index < ret.trendList.length; index++) {
          arr.push(false);
        }
        this.statusArr = arr;
        this.tableData = ret.trendList;
        this.totalCount = ret.totalCount;
      }
    },
    //任务标记
    changeZero(val, index) {
      if (val) {
        for (const i in this.statusArr) {
          if (index != i) {
            this.statusArr[i] = false;
          }
        }
        this.statusArr[index] = val;
        this.$store.dispatch("user/markTrendTask", {
          page: this.currentPage,
          index
        });
      } else {
        this.statusArr[index] = false;
        this.$store.dispatch("user/markTrendTask", null);
      }
    },
    //分页回调
    async handleCurrentChange(val) {
      this.currentPage = val;
      this.getTrendReportMessage(val);
    }
  },
  mounted() {
    this.getTrendReportMessage();
    if (
      this.$store.state.user.trendTask &&
      this.$store.state.user.trendTask.page === 1
    ) {
      this.statusArr[this.$store.state.user.trendTask.index] = true;
    }
  }
};
</script>
<style scoped lang="less">
.app-container {
  .title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #909399;
    margin-bottom: 10px;
  }
  .status-table {
    .bio-container {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      display: -webkit-box;
    }
  }
  .my-pagination {
    margin-left: 40%;
    margin-top: 30px;
  }
}
</style>

