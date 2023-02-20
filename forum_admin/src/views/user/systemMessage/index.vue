<template>
  <div class="editor-container">
    <div class="message-box">编辑公告</div>
    <div class="edit-view">
      <Editor
        :initialValue="editorText"
        height="580px"
        ref="toastuiEditor"
        language="zh_CN"
        @blur="getHtml"
        :options="editorOptions"
        initialEditType="wysiwyg"
        previewStyle="vertical"
      />
    </div>
    <div class="article-message">
      <el-form
        :model="articleMessage"
        status-icon
        :rules="rules"
        ref="articleMessage"
        label-width="100px"
        class="demo-ruleForm article-form"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleMessage.title" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告摘要" prop="message">
          <el-input
            type="textarea"
            :rows="3"
            maxlength="120"
            show-word-limit
            v-model="articleMessage.message"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('articleMessage')">提交</el-button>
          <el-button @click="resetForm('articleMessage')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import "@toast-ui/editor/dist/i18n/zh-cn";
export default {
  name: "Email",
  components: {
    Editor
  },
  data() {
    var validateTitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入标题"));
      } else {
        callback();
      }
    };
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入摘要"));
      } else {
        callback();
      }
    };
    return {
      editorText: "",
      editorOptions: {
        hideModeSwitch: false,
        language: "zh-CN"
      },
      articleMessage: {
        title: "",
        message: "",
        body: ""
      },
      rules: {
        title: [{ validator: validateTitle, trigger: "blur" }],
        description: [{ validator: validateDescription, trigger: "blur" }]
      }
    };
  },
  methods: {
    getHtml() {
      this.editorText = this.$refs.toastuiEditor.invoke("getHTML");
      this.articleMessage.body = this.editorText;
    },
    submitForm(formName) {
      if (this.editorText === "") {
        return this.$message({
          type: "warning",
          message: "还没有添加公告内容哦！"
        });
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          //验证成功
          const notice = this.articleMessage;
          notice.user = this.$store.state.user._id;

          const ret = await this.$API.user.createNotice(notice);
          if (ret.code === 200) {
            this.$message({
              type: "success",
              message: "推送成功"
            });
            this.$refs[formName].resetFields();
            this.$refs.toastuiEditor.invoke("reset");
          }
        } else {
          //验证失败
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs.toastuiEditor.invoke("reset");
      this.editorText = "";
    },
    //自定义图片上传
    async myImgUpload() {
      const editor = this.$refs.toastuiEditor;
      editor.invoke("removeHook", "addImageBlobHook");
      editor.invoke("addHook", "addImageBlobHook", async (blob, callback) => {
        const formData = new FormData();
        formData.append("files", blob);
        const ret = await this.$API.user.handleNoticeImg(formData);
        if (ret.code === 200) {
          const url = ret.url;
          callback(url);
        }
      });
    }
  },
  mounted() {
    this.myImgUpload();
  }
};
</script>

<style lang="less" scoped>
.editor-container {
  margin-top: 20px;
  .message-box {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #909399;
    margin-left: 17px;
  }
  .edit-view {
    transition: inherit;
    background-color: white;
    width: 1000px;
    border-radius: 0.5rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
  }
  .article-message {
    transition: inherit;
    width: 1000px;
    background-color: white;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .article-form {
      padding-top: 20px;
      padding-bottom: 5px;
      margin-top: 20px;
      width: 90%;
      .my-tag-input {
        width: 100px;
      }
      .my-tag-item {
        margin-right: 5px;
      }
    }
  }
}
</style>