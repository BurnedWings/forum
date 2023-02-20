<template>
  <div class="audit-container">
    <div class="title">待审核文章</div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column prop="createdAt" label="投稿日期" width="120">
        <template slot-scope="scoped">
          <span>{{$dayjs(scoped.row.createdAt).format("YYYY/MM/DD")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="文章封面" width="120">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.cover"
            style="width: 60%;"
            :src="$myBaseUrl+scope.row.cover"
            :preview-src-list="[$myBaseUrl+scope.row.cover]"
          ></el-image>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" width="190">
        <template slot-scope="scope">
          <div class="bio-container">
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bio" label="文章摘要" width="250">
        <template slot-scope="scope">
          <el-popover placement="top" width="250" trigger="hover" :content="scope.row.description">
            <div slot="reference" class="bio-container">
              <span>{{scope.row.description}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者头像" width="120">
        <template slot-scope="scope">
          <img
            @click="showDetailUser(scope.row.author._id)"
            style="width: 50%;border-radius: 50%;cursor: pointer;"
            :src="$myBaseUrl+scope.row.author.image"
            alt
          />
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者昵称" width="140">
        <template slot-scope="scope">{{scope.row.author.username}}</template>
      </el-table-column>
      <el-table-column prop="category" label="文章分类" width="100">
        <template slot-scope="scope">{{scope.row.category.content}}</template>
      </el-table-column>
      <el-table-column class="doColumn" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            style="margin-right:10px;"
            @click="showDetail(scope.row)"
            slot="reference"
            size="mini"
            type="primary"
          >查看详情</el-button>
          <el-popconfirm
            @confirm="violateTheUser(scope.row,scope.row.author._id)"
            title="你确定要将该文章通过审核嘛"
          >
            <el-button style="margin-right:10px;" slot="reference" size="mini" type="success">通过</el-button>
          </el-popconfirm>
          <el-button
            @click="toReturnTheArticle(scope.row,scope.row.author._id)"
            size="mini"
            type="danger"
          >退回</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-button type="danger" @click="backTheArticle">确定退回</el-button>
      </span>
    </el-dialog>
    <el-drawer
      v-if="targetArticle"
      title="文章详情"
      class="my-drawer"
      :visible.sync="drawer"
      direction="ltr"
      :size="920"
    >
      <div class="article-container">
        <div class="title">{{targetArticle.title}}</div>
        <div class="article-message">
          <span>{{$dayjs(targetArticle.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </div>
        <div class="author-info">
          <img class="author-image" :src="$myBaseUrl+targetArticle.author.image" />
          <div class="author-message">
            <span class="author-name">{{targetArticle.author.username}}</span>
            <br />
            <span class="author-fans">粉丝:&nbsp;&nbsp;{{targetArticle.author.fansCount}}</span>
            <span>文章:&nbsp;&nbsp;{{targetArticle.author.articleCount}}</span>
          </div>
        </div>
        <div class="title-line"></div>
        <div class="articleBody" v-html="targetArticle.body"></div>
        <div class="article-tag">
          <span v-for="(tag,index) in targetArticle.tagList">#{{tag}}</span>
        </div>
        <div class="bottom-line"></div>
      </div>
    </el-drawer>
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
  name: "Audit",
  data() {
    return {
      drawer: false,
      tableData: [],
      totalCount: 0,
      currentPage: null,
      targetArticle: null,
      dialogVisible: false,
      textarea: "",
      backArticle: null,
      backUser: null
    };
  },
  methods: {
    showDetailUser(userId) {
      this.$router.push({
        name: "UserStatus",
        params: {
          userId
        }
      });
    },
    showDetail(val) {
      this.targetArticle = val;
      this.drawer = true;
      this.$nextTick(() => {
        document.querySelector(".el-drawer__body").scrollTo(0, 0);
      });
    },
    //通过审核
    async violateTheUser(article, ofUser) {
      const ret = await this.$API.article.auditTheArticle(article._id);
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.currentPage -= 1;
        }
        this.getNotAuditArticle();
        await this.$API.article.articleStatusMessage({
          type: 1,
          article: article.title,
          ofUser
        });
      }
    },
    //退回文章
    async backTheArticle() {
      if (this.textarea.trim() === "") {
        return this.$message({
          type: "warning",
          message: "你还没有输入描述信息~"
        });
      }
      const article = this.backArticle;
      const ofUser = this.backUser;
      const ret = await this.$API.article.backTheArticle(article._id);
      if (ret.code === 200) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          this.currentPage -= 1;
        }

        this.getNotAuditArticle();
        const message = this.textarea.trim();
        await this.$API.article.articleStatusMessage({
          type: 2,
          article: article.title,
          ofUser,
          message
        });
        this.textarea = "";
        this.$message({
          type: "success",
          message: "退回成功~"
        });
      }
      this.dialogVisible = false;
    },
    //获取未审核文章
    async getNotAuditArticle() {
      let ret;
      if (this.currentPage) {
        if (this.tableData.length === 1 && this.currentPage != 1) {
          ret = await this.$API.article.getNotAuditArticle(
            this.currentPage - 1
          );
        } else {
          ret = await this.$API.article.getNotAuditArticle(this.currentPage);
        }
      } else {
        ret = await this.$API.article.getNotAuditArticle();
      }
      if (ret.code === 200) {
        this.tableData = ret.articleList;
        this.totalCount = ret.totalCount;
      }
    },
    //分页事件
    async handleCurrentChange(val) {
      this.currentPage = val;
      const ret = await this.$API.article.getNotAuditArticle(val);
      if (ret.code === 200) {
        this.tableData = ret.articleList;
      }
    },
    handleClose() {
      this.dialogVisible = false;
      this.backArticle = null;
      this.backUser = null;
      this.textarea = "";
    },
    //打开退回框
    toReturnTheArticle(article, ofUser) {
      this.backArticle = article;
      this.backUser = ofUser;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.messageBox.focus();
      });
    }
  },
  mounted() {
    this.getNotAuditArticle();
  }
};
</script>
<style lang='less'>
.el-drawer__body {
  overflow-y: auto;
  overflow-x: hidden;
}
.articleBody {
  img {
    margin-left: 50%;
    transform: translateX(-50%);
    max-width: 90%;
  }
}
</style>
<style lang='less' scoped>
.audit-container {
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
  .my-drawer {
    .article-container {
      transition: all 0.5s;
      width: 750px;
      min-height: 200px;
      margin-left: 80px;
      padding-bottom: 10px;
      border-radius: 0.5rem;
      box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
      .title {
        color: rgba(0, 0, 0, 0.763);
        font-size: 25px;
        font-weight: 550;
        text-align: left;
        padding-top: 20px;
        padding-left: 80px;
        padding-right: 90px;
      }
      .article-message {
        margin-top: 15px;
        padding: 0 90px;
        span {
          margin-right: 18px;
        }
      }
      .author-info {
        padding: 0 90px;
        margin-top: 25px;
        margin-bottom: 20px;
        .author-image {
          float: left;
          width: 44px;
          border-radius: 50%;
          margin-right: 10px;
          cursor: pointer;
        }
        .author-message {
          float: left;
          width: 300px;
          font-size: 15px;
          margin-top: 7px;
          .author-fans {
            margin-right: 20px;
          }
          .author-name {
            cursor: pointer;
          }
        }
      }
      .author-info:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }

      .title-line {
        width: 90%;
        background-color: rgb(131, 130, 130);
        height: 1px;
        margin: 0 auto;
        transform: scaleY(0.7);
        margin-bottom: 20px;
      }
      .articleBody {
        width: 83%;
        margin: 0 auto;
        font-size: 17px;
        padding: 20px 13px;
        // transform: scale(0.7, 0.7);
      }
      .article-tag {
        width: 80.5%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 30px;
        font-size: 13px;
        font-style: italic;
        span {
          margin-right: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }
        span:hover {
          color: var(--theme_search_input_blue_color);
        }
      }

      .bottom-line {
        width: 90%;
        background-color: rgb(131, 130, 130);
        height: 1px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;

        transform: scaleY(0.7);
        margin-bottom: 30px;
      }

      .share-box {
        width: 190px;
        text-align: center;
        margin-left: 85px;
        float: left;
        .box-container {
          text-align: center;
          padding: 0;
          font-size: 15px;
          .share-box-item {
            display: inline;
            margin-left: 7px;
            transition: color 0.2s;
            cursor: pointer;
            i {
              font-size: 18px;
            }
          }
          .share-box-item:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
      }

      .article-advice {
        width: 150px;
        text-align: center;
        float: right;
        margin-right: 10px;
        cursor: pointer;
        font-size: 14px;
      }

      // .articleBody :deep(img) {
      //   margin-left: 50%;
      //   transform: translateX(-50%);
      //   max-width: 10%;
      // }
    }
    .article-container:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }
  .my-pagination {
    margin-left: 45%;
    margin-top: 20px;
  }
}
</style>