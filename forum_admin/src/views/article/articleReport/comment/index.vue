<template>
  <div class="app-container">
    <div class="title">待处理评论举报</div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column prop="date" label="提交日期" width="140">
        <template slot-scope="scope">{{$dayjs(scope.row.createdAt).format("YYYY/MM/DD HH:mm")}}</template>
      </el-table-column>
      <el-table-column prop="title" label="评论内容" width="190">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.comment?scope.row.comment.body:scope.row.reply.body"
          >
            <div slot="reference" class="bio-container">
              <span v-if="scope.row.comment">{{scope.row.comment.body}}</span>
              <span v-else>{{scope.row.reply.body}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="评论发布日期" width="140">
        <template slot-scope="scope">
          <span
            v-if="scope.row.comment"
          >{{$dayjs(scope.row.comment.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
          <span v-else>{{$dayjs(scope.row.reply.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="发布者" width="120">
        <template slot-scope="scope">
          <img @click="showDetailUser(scope.row.ofUser._id)" style="width: 50%;border-radius: 50%;cursor: pointer;" :src="$myBaseUrl+scope.row.ofUser.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="bio" label="用户反馈" width="260">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.message"
          >
            <div slot="reference" class="bio-container">
              <span>{{scope.row.message}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="举报者" width="120">
        <template slot-scope="scope">
          <img @click="showDetailUser(scope.row.user._id)" style="width: 50%;border-radius: 50%;cursor: pointer;" :src="$myBaseUrl+scope.row.user.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="type.content" label="违规类型" width="120"></el-table-column>
      <el-table-column class="doColumn" label="操作" width="180">
        <template slot-scope="scope">
          <el-popconfirm
            @confirm="deleteTheComment(scope.row._id,scope.row.comment,scope.row.reply)"
            title="你确定要删除该评论嘛"
          >
            <el-button style="margin-right:10px;" slot="reference" size="mini" type="danger">删除评论</el-button>
          </el-popconfirm>
          <el-popconfirm @confirm="finishCommentReport(scope.row._id)" title="你确定要结束该此任务嘛">
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
  name: "ArticleCommentReport",
  data() {
    return {
      tableData: [],
      totalCount: 0,
      currentPage: 1
    };
  },
  watch: {},
  methods: {
    showDetailUser(userId){
      this.$router.push({
        name:'UserStatus',
        params:{
          userId
        }
      })
    },
    //获取举报任务
    async getArticleCommentReport(page) {
      let ret;
      if (page) {
        ret = await this.$API.article.getArticleCommentReport(page);
      } else {
        ret = await this.$API.article.getArticleCommentReport();
      }
      if (ret.code === 200) {
        this.tableData = ret.commentReport;
        this.totalCount = ret.totalCount;
      }
    },
    //分页事件
    async handleCurrentChange(val) {
      this.currentPage = val;
      this.getArticleCommentReport(val);
    },
    //完成评论举报任务
    async finishCommentReport(taskId) {
      const ret = await this.$API.article.finishTheArticleCommentTask(taskId);
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.getArticleCommentReport(this.currentPage - 1);
          this.currentPage -= 1;
        } else {
          this.getArticleCommentReport(this.currentPage);
        }
        this.$message({
          type: "success",
          message: "任务已完成，再接再厉"
        });
      }
    },
    //删除评论
    async deleteTheComment(taskId, comment, reply) {
      // console.log(taskId,ofUser,comment._id,reply)
      let ret;
      if (comment) {
        //删除评论
        const myComment = comment._id;
        const article = comment.article;
        ret = await this.$API.article.deleteReportComment(
          taskId,
          myComment,
          article
        );
      } else {
        //删除回复
        ret = await this.$API.article.deleteReportReply(reply._id, taskId);
      }
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.getArticleCommentReport(this.currentPage - 1);
          this.currentPage -= 1;
        } else {
          this.getArticleCommentReport(this.currentPage);
        }
        this.$message({
          type: "success",
          message: "删除成功，任务已完成~"
        });
      }
    }
  },
  mounted() {
    this.getArticleCommentReport();
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

