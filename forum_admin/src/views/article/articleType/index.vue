<template>
  <div class="type-container">
    <div class="top-container">
      <div class="tag-container">
        <span class="title">已创建标签</span>
        <div class="tag-box">
          <el-tag
            @click="toUpdateTheTag(tag)"
            style="cursor: pointer;"
            v-for="(tag,index) in tagInfo"
            :key="index"
          >
            {{tag.name}}
            <i class="el-icon-edit"></i>
          </el-tag>
        </div>
        <el-button @click="dialogVisible = true" size="mini" type="primary">添加标签</el-button>
      </div>
      <div class="handle-container"></div>
    </div>
    <el-dialog title="新建文章类型" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input maxlength="4" show-word-limit v-model="input" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTheTag">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改文章类型"
      :visible.sync="updateDialogVisible"
      width="30%"
      :before-close="updateHandleClose"
    >
      <el-input maxlength="4" show-word-limit v-model="updateInput" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTheTag">提 交</el-button>
      </span>
    </el-dialog>
    <div class="cloud-container">
      <ul data-show-value="true" class="cloud" role="navigation" aria-label="Webdev tag cloud">
        <li v-for="(tag,index) in tagInfo" :key="index">
          <a :style="`font-size:${tag.compare*6+1}vw;`" :data-weight="tag.value">{{tag.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleType",
  data() {
    return {
      dialogVisible: false,
      input: "",
      tagName: null,
      tagValue: null,
      tagInfo: null,
      updateDialogVisible: false,
      updateInput: "",
      targetTag: null,
      idArr: null
    };
  },
  methods: {
    toUpdateTheTag(tag) {
      this.updateDialogVisible = true;
      this.updateInput = tag.name;
      this.targetTag = tag.id;
    },
    updateHandleClose() {
      this.updateInput = "";
      this.updateDialogVisible = false;
      this.targetTag = null;
    },
    async updateTheTag() {
      const type = {};
      type.id = this.targetTag;
      type.content = this.updateInput;
      const ret = await this.$API.board.updateTheArticleType(type);
      if (ret.code === 200) {
        console.log(ret)
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.updateInput = "";
        this.updateDialogVisible = false;
        this.targetTag = null;
        this.getTypeArticleCount();
      }
    },
    //关闭回调
    handleClose() {
      this.input = "";
      this.dialogVisible = false;
    },
    //创建标签
    async createTheTag() {
      const ret = await this.$API.article.createArticleType({
        content: this.input
      });
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        this.getTypeArticleCount();
        this.input = "";
        this.dialogVisible = false;
      }
    },
    //获取文章类型
    async getTypeArticleCount() {
      const ret = await this.$API.board.getTypeArticleCount();
      if (ret.code === 200) {
        this.idArr = ret.idArr;
        this.tagValue = ret.value;
        let sum = 0;
        this.tagValue.forEach(item => {
          sum += item;
        });
        this.tagName = ret.name;
        let arr = [];
        for (const j in this.tagValue) {
          arr.push({
            name: this.tagName[j],
            value: this.tagValue[j],
            compare: this.tagValue[j] / sum,
            id: this.idArr[j]
          });
        }
        this.tagInfo = arr;
      }
    }
  },
  mounted() {
    this.getTypeArticleCount();
  }
};
</script>

<style lang="less" scoped>
.type-container {
  .top-container {
    height: 100px;
    margin-bottom: 50px;
    padding-top: 20px;
    .tag-container {
      font-size: 14px;
      font-weight: 600;
      color: #909399;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .title {
        display: block;
        padding-top: 8px;
        margin-right: 20px;
        margin-bottom: 10px;
      }
      .tag-box {
        .el-tag {
          margin-bottom: 10px;
          margin-right: 24px;
        }
      }
      .el-button {
        position: absolute;
        height: 32px;
        right: 10px;
        width: 80px;
      }
    }
  }
  .cloud-container {
    .cloud {
      margin: auto;
      width: 800px;
      height: 400px;
      list-style: none;
      padding-left: 0;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      line-height: 2.5rem;
      li {
        margin-right: 50px;
        a {
          display: block;
          --size: 4;
          font-size: calc(var(--size) * 0.25rem + 0.5rem);
          padding: 0.125rem 0.25rem;
          text-decoration: none;
          position: relative;
          cursor: default;
        }
        &:nth-child(2n + 1) {
          color: #181;
        }
        &:nth-child(3n + 1) {
          color: #33a;
        }
        &:nth-child(4n + 1) {
          color: #c38;
        }
      }
    }
    // .cloud a[data-weight="0"] {
    //   --size: 3;
    // }
    // .cloud a[data-weight="1"] {
    //   --size: 5;
    // }
    // .cloud a[data-weight="2"] {
    //   --size: 6;
    // }
    // .cloud a[data-weight="3"] {
    //   --size: 7;
    // }
    // .cloud a[data-weight="4"] {
    //   --size: 8;
    // }
    // .cloud a[data-weight="5"] {
    //   --size: 9;
    // }
    // .cloud a[data-weight="6"] {
    //   --size: 10;
    // }
    // .cloud a[data-weight="7"] {
    //   --size: 11;
    // }
    // .cloud a[data-weight="8"] {
    //   --size: 12;
    // }
    // .cloud a[data-weight="9"] {
    //   --size: 11;
    // }
    .cloud[data-show-value] a::after {
      content: " (" attr(data-weight) ")";
      font-size: 1rem;
    }
  }
}
</style>