<template>
  <div class="audit-container">
    <div class="title">待审核动态</div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column prop="date" label="投稿日期" width="160">
        <template slot-scope="scoped">
          <span>{{$dayjs(scoped.row.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bio" label="动态描述" width="280">
        <template slot-scope="scope">
          <div style="margin-right:40px;" class="bio-container">
            <span>{{scope.row.body}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="imageCount" label="配图张数" width="130">
        <template slot-scope="scope">{{scope.row.image.length}}</template>
      </el-table-column>
      <el-table-column prop="image" label="作者头像" width="160">
        <template slot-scope="scope">
          <img @click="showDetailUser(scope.row.user._id)" style="width: 33%;border-radius: 50%;cursor: pointer;" :src="$myBaseUrl+scope.row.user.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="user.violateCount" label="违规次数" width="130"></el-table-column>
      <el-table-column prop="user.username" label="作者昵称" width="180"></el-table-column>
      <el-table-column class="doColumn" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            style="margin-right:10px;"
            @click="showDetail(scope.row)"
            slot="reference"
            size="mini"
            type="primary"
          >查看详情</el-button>
          <el-popconfirm @confirm="passTheTrend(scope.row._id)" title="你确定要将该文章通过审核嘛">
            <el-button style="margin-right:10px;" slot="reference" size="mini" type="success">通过</el-button>
          </el-popconfirm>
          <!-- <el-popconfirm @confirm="lockTheTrend(scope.row._id)" title="你确定要将该文章通过审核嘛">
            
          </el-popconfirm>-->
          <el-button @click="toLockTheTrend(scope.row._id)" size="mini" type="danger">锁定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="动态详情"
      class="my-drawer"
      v-if="targetTrend"
      :visible.sync="drawer"
      direction="ltr"
      size="40%"
    >
      <div class="trend-item">
        <div class="trend-item-top">
          <img @click="showDetailUser(targetTrend.user._id)" style="cursor: pointer;" :src="targetTrend?$myBaseUrl+targetTrend.user.image:''" alt />
          <div class="username">{{targetTrend?targetTrend.user.username:''}}</div>
          <div
            class="updateDate"
          >{{targetTrend?$dayjs(targetTrend.createdAt).format("YYYY/MM/DD"):''}}&nbsp;更新</div>
        </div>
        <div class="trend-body">
          <span class="content-container" v-html="targetTrend?targetTrend.body:''"></span>
          <div v-if="targetTrend" class="img-container">
            <div
              v-for="(img,index) in targetTrend.image"
              style="width:200px;height:200px;overflow:hidden;display:inline-block;margin-right:5px;"
            >
              <el-image
                :key="index"
                style="width:100%;height: 100%;"
                :src="img"
                fit="cover"
                :preview-src-list="targetTrend.image"
              ></el-image>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      title="请输入具体描述"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      close="my-return-box"
      :modal-append-to-body="false"
    >
      <el-input
        type="textarea"
        :rows="6"
        ref="messageBox"
        resize="none"
        maxlength="160"
        show-word-limit
        placeholder="请输入内容"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="lockTheTrend">确定锁定</el-button>
      </span>
    </el-dialog>
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
  name: "TrendAudit",
  data() {
    return {
      drawer: false,
      tableData: [],
      totalCount: 0,
      targetTrend: null,
      dialogVisible: false,
      textarea: "",
      targetLockTrend: null
    };
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
    toLockTheTrend(val) {
      this.targetLockTrend = val;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.messageBox.focus();
      });
    },
    //关闭回调
    handleClose() {
      this.textarea = "";
      this.targetLockTrend = null;
      this.dialogVisible = false;
    },
    //查看详情
    showDetail(val) {
      if (val.image.length > 0 && !val.image[0].includes("http")) {
        for (const i in val.image) {
          val.image[i] = this.$myBaseUrl + val.image[i];
        }
      }
      this.targetTrend = val;
      this.drawer = true;
    },
    //锁定动态
    async lockTheTrend() {
      if (this.textarea.trim() === "") {
        return this.$message({
          type: "warning",
          message: "你还没有输入描述信息~"
        });
      }
      const ret = await this.$API.trend.lockTheTrend(
        this.targetLockTrend,
        this.textarea.trim()
      );
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.currentPage -= 1;
        }
        this.textarea = "";
        this.targetLockTrend = null;
        this.dialogVisible = false;
        this.getNotAuditTrend(this.currentPage);
        this.$message({
          type: "success",
          message: "该动态已锁定~"
        });
      }
    },
    //通过动态审核
    async passTheTrend(val) {
      const ret = await this.$API.trend.auditTheTrend(val);
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.currentPage -= 1;
        }
        this.getNotAuditTrend(this.currentPage);
        this.$message({
          type: "success",
          message: "该动态已通过审核~"
        });
      }
    },
    //获取待审核动态
    async getNotAuditTrend(page) {
      let ret;
      if (page) {
        ret = await this.$API.trend.getNotAuditTrend(page);
      } else {
        ret = await this.$API.trend.getNotAuditTrend();
      }
      if (ret.code === 200) {
        this.tableData = ret.trendList;
        this.totalCount = ret.totalCount;
      }
    },
    //分页事件
    async handleCurrentChange(val) {
      this.currentPage = val;
      const ret = await this.$API.trend.getNotAuditTrend(val);
      if (ret.code === 200) {
        this.tableData = ret.trendList;
        this.totalCount = ret.totalCount;
      }
    }
  },
  mounted() {
    this.getNotAuditTrend();
  }
};
</script>

<style lang='less' scoped>
.audit-container {
  padding-top: 25px;
  padding-left: 15px;
  .title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #909399;
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .status-table {
    .bio-container {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      display: -webkit-box;
    }
  }
  .my-drawer {
    .el-image {
      // width: 180px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .trend-item {
      width: 100%;
      padding-top: 5px;
      padding-bottom: 0px;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .item-line {
        height: 1px;
        transform: scaleY(0.5);
        background-color: rgb(131, 130, 130);
        margin-bottom: 10px;
      }
      .trend-item-top {
        position: relative;
        img {
          width: 49px;
          border-radius: 50%;
          margin-left: 15px;
          margin-top: 5px;
        }
        .username {
          position: absolute;
          top: 10px;
          margin-left: 10px;
          display: inline-block;
        }
        .updateDate {
          position: absolute;
          top: 33px;
          left: 73px;
          font-size: 14px;
          display: inline-block;
        }
        .my-edit-icon {
          float: right;
          margin-top: 25px;
          margin-right: 20px;
        }
      }
      .trend-body {
        margin-top: 10px;
        padding-left: 72px;
        padding-right: 20px;
        padding-bottom: 10px;
        cursor: default;
        .img-container {
          width: 82%;
          margin-top: 10px;
          margin-left: 2px;
          & :deep(.el-image) {
            width: 180px;
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }
      }
      .trend-message {
        width: 300px;
        margin-top: 20px;
        margin-left: 75px;
        float: left;
        &:after {
          /*伪元素是行内元素 正常浏览器清除浮动方法*/
          content: "";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        .trend-message-item {
          float: left;
          margin-right: 15px;
          font-size: 14px;
          cursor: pointer;
          transition: color 0.3s;

          i {
            font-size: 14px;
            font-weight: 600;
          }
          .my-kudos {
            color: var(--theme_search_input_blue_color);
          }
        }
        .trend-message-item:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }
  }
  .my-pagination {
    margin-left: 40%;
    margin-top: 30px;
  }
}
</style>