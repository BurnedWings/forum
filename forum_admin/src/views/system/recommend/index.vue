<template>
  <div class="audit-container">
    <div class="switch-container">
      <div class="switch-item">
        <span>查询未推荐文章</span>
        <el-switch @change="changeOne" v-model="value1"></el-switch>
      </div>
      <div class="switch-item">
        <span>查询已推荐文章</span>
        <el-switch @change="changeTwo" v-model="value2"></el-switch>
      </div>
    </div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column prop="date" label="投稿日期" width="140">
        <template slot-scope="scoped">
          <span>{{$dayjs(scoped.row.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cover" label="文章封面" width="130">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.cover"
            style="width: 50%;"
            :src="$myBaseUrl+scope.row.cover"
            :preview-src-list="[$myBaseUrl+scope.row.cover]"
          ></el-image>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" width="200">
        <template slot-scope="scope">
          <div class="bio-container">
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bio" label="文章摘要" width="240">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="250"
            trigger="hover"
            :content="scope.row.description"
          >
            <div slot="reference" class="bio-container">
              <span>{{scope.row.description}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="clicksCount" label="浏览次数" width="120"></el-table-column>
      <el-table-column prop="favoritesCount" label="点赞次数" width="120"></el-table-column>
      <el-table-column prop="category.content" label="文章分类" width="120"></el-table-column>
      <el-table-column class="doColumn" label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            style="margin-right:10px;"
            @click="showDetail(scope.row)"
            slot="reference"
            size="mini"
            type="primary"
          >查看详情</el-button>
          <el-popconfirm
            v-if="!scope.row.isRecommend"
            @confirm="recommendTheArticle(scope.row._id)"
            title="你确定要推荐该文章嘛"
          >
            <el-button slot="reference" size="mini" type="success">推荐</el-button>
          </el-popconfirm>
          <el-popconfirm
            v-else
            @confirm="cancelArticleRecommend(scope.row._id)"
            title="你确定要取消该文章的推荐嘛"
          >
            <el-button slot="reference" size="mini" type="danger">取消推荐</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
          <img @click="showDetailUser(targetArticle.author._id)"  class="author-image" :src="$myBaseUrl+targetArticle.author.image" />
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
      :total="totalPage"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Recommend",
  data() {
    return {
      drawer: false,
      value1: true,
      value2: false,
      tableData: [],
      totalPage: 0,
      currentPage: 1,
      targetArticle: null,
      recommendCount: null
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
    showDetail(val) {
      this.targetArticle = val;
      this.drawer = true;
      this.$nextTick(() => {
        document.querySelector(".el-drawer__body").scrollTo(0, 0);
      });
    },
    async cancelArticleRecommend(val) {
      const ret = await this.$API.system.cancelArticleRecommend(val);
      if (ret.code === 200) {
        this.getRecommendArticle();
        this.$message({
          type: "success",
          message: "取消推荐成功~"
        });
      }
    },
    changeOne(val) {
      if (val) {
        this.value2 = false;
        this.getNotRecommendArticle();
      } else {
        this.value2 = true;
        this.getRecommendArticle();
      }
    },
    changeTwo(val) {
      if (val) {
        this.value1 = false;
        this.getRecommendArticle();
      } else {
        this.value1 = true;
        this.getNotRecommendArticle();
      }
    },
    //获取未推荐文章
    async getNotRecommendArticle(page) {
      let ret;
      if (page) {
        ret = await this.$API.system.getNotRecommendArticle(page);
      } else {
        ret = await this.$API.system.getNotRecommendArticle();
      }
      if (ret.code === 200) {
        this.tableData = ret.articleList;
        this.totalPage = ret.totalCount;
        this.recommendCount = ret.recommendCount;
      }
    },
    //分页事件
    async handleCurrentChange(val) {
      this.currentPage = val;
      this.getNotRecommendArticle(val);
    },
    //推荐文章
    async recommendTheArticle(val) {
      if (this.recommendCount >= 5) {
        this.$message({
          type: "warning",
          message: "最多只能推荐五篇文章哦~"
        });
      } else {
        const ret = await this.$API.system.recommendTheArticle(val);
        if (ret.code === 200) {
          if (this.tableData.length === 1 && this.currentPage != 1) {
            this.currentPage -= 1;
          }
          this.getNotRecommendArticle(this.currentPage);
          this.$message({
            type: "success",
            message: "推荐成功~"
          });
        }
      }
    },
    async getRecommendArticle() {
      const ret = await this.$API.system.getRecommendArticle();
      if (ret.code === 200) {
        this.tableData = ret.articleList;
        this.totalPage = ret.totalCount;
      }
    }
  },
  mounted() {
    this.getNotRecommendArticle();
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
  padding-left: 15px;
  padding-top: 15px;
  .title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #909399;
    margin-bottom: 10px;
  }

  .switch-container {
    margin-top: 25px;
    .switch-item {
      margin-left: 11px;
      display: inline-block;
      margin-right: 20px;
      span {
        font-size: 14px;
        font-weight: 600;
        color: #909399;
      }
    }
  }
  .status-table {
    margin-top: 10px;
    .bio-container {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
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
    margin-left: 40%;
    margin-top: 20px;
  }
}
</style>