<template>
  <div class="admin-view">
    <div class="title-container">
      <span class="title">管理员and权限管理</span>
      <el-button
        @click="toCreateAdmin"
        style="float:right;margin-right:35px;"
        size="mini"
        type="primary"
      >添加管理员</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="添加日期" width="180">
          <template slot-scope="scope">
            <span>{{ $dayjs(scope.row.createdAt).format("YYYY/MM/DD HH:mm") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="管理员头像" width="180">
          <template slot-scope="scope">
            <el-image
              style="width:35%;border-radius: 8px;"
              :src="$myBaseUrl+scope.row.image"
              fit="fill"
              :lazy="true"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="管理员昵称" width="180"></el-table-column>
        <el-table-column prop="name" label="管理员权限" width="670">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.permissionsList.includes(1)" style="margin-right:25px;">用户管理</el-tag>
            <el-tag v-if="scope.row.permissionsList.includes(2)" style="margin-right:25px;">文章管理</el-tag>
            <el-tag v-if="scope.row.permissionsList.includes(3)" style="margin-right:25px;">动态管理</el-tag>
            <el-tag v-if="scope.row.permissionsList.includes(4)" style="margin-right:25px;">前台信息管理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="toUpdateTheAdmin(scope.row)" size="mini" type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加管理员" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input v-model="adminName" placeholder="管理员昵称"></el-input>
      <el-input
        style="margin-top:20px;margin-bottom:20px;"
        v-model="password"
        show-password
        placeholder="管理员密码"
      ></el-input>
      <el-upload action ref="upload" :limit="1" list-type="picture-card" :http-request="uploadFile">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-checkbox-group style="margin-top:20px;" v-model="checkList">
        <el-checkbox :label="1">用户管理</el-checkbox>
        <el-checkbox :label="2">文章管理</el-checkbox>
        <el-checkbox :label="3">动态管理</el-checkbox>
        <el-checkbox :label="4">前台管理</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTheAdmin">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="targetAdmin"
      title="管理员信息"
      :visible.sync="updateDialog"
      width="30%"
      :before-close="updateHandleClose"
    >
      <el-input v-model="targetAdmin.username" placeholder="管理员昵称"></el-input>
      <el-input
        style="margin-top:20px;margin-bottom:20px;"
        v-model="updatePassword"
        show-password
        placeholder="管理员密码"
      ></el-input>
      <el-upload
        action
        ref="updateUpload"
        :limit="1"
        list-type="picture-card"
        :http-request="updateUploadFile"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-checkbox-group style="margin-top:20px;" v-model="targetAdmin.permissionsList">
        <el-checkbox :label="1">用户管理</el-checkbox>
        <el-checkbox :label="2">文章管理</el-checkbox>
        <el-checkbox :label="3">动态管理</el-checkbox>
        <el-checkbox :label="4">前台管理</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateTheAdmin">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Permissions",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      adminName: "",
      password: "",
      checkList: [],
      imgUrl: null,
      targetAdmin: {},
      updateDialog: false,
      updatePassword: null,
      updateImgUrl: null
    };
  },
  methods: {
    //添加管理员
    toCreateAdmin() {
      if (this.tableData.length >= 6) {
        return this.$message({
          type: "warning",
          message: "最多设置六个管理员"
        });
      }
      this.dialogVisible = true;
    },
    async updateUploadFile(params) {
      const _file = params.file;
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
      const ret = await this.$API.admin.setAdminImage(formData);
      if (ret.code === 200) {
        this.updateImgUrl = ret.url;
      }
    },
    updateHandleClose() {
      this.updateImgUrl = null
      this.updatePassword = null
      this.updateDialog = false;
    },
    //更新管理员信息
    async updateTheAdmin() {
      const admin = {};
      admin._id = this.targetAdmin._id;
      admin.username = this.targetAdmin.username;
      if (this.updateImgUrl) {
        admin.image = this.updateImgUrl;
      }
      if (this.updatePassword) {
        admin.password = this.updatePassword;
      }
      admin.permissionsList = this.targetAdmin.permissionsList;
      const ret = await this.$API.admin.updateTheAdmin(admin);
      if (ret.code === 200) {
        this.updateDialog = false;
        this.$refs.updateUpload.clearFiles();
        this.$message({
          type: "success",
          message: "更新成功"
        });
        this.getOtherAdmin();
      }
    },
    toUpdateTheAdmin(admin) {
      this.$set(this.targetAdmin, "username", admin.username);
      this.$set(this.targetAdmin, "_id", admin._id);
      this.$set(this.targetAdmin, "permissionsList", admin.permissionsList);
      this.updateDialog = true;
    },
    async createTheAdmin() {
      if (this.adminName.trim() === "") {
        return this.$message({
          type: "warning",
          message: "没有输入管理员昵称"
        });
      }
      if (this.password.trim() === "") {
        return this.$message({
          type: "warning",
          message: "没有输入管理员密码"
        });
      }
      if (this.imgUrl === null) {
        return this.$message({
          type: "warning",
          message: "没有设置管理员头像"
        });
      }
      if (this.checkList.length === 0) {
        return this.$message({
          type: "warning",
          message: "没有设置管理员权限"
        });
      }
      const admin = {};
      admin.username = this.adminName.trim();
      admin.password = this.password;
      admin.permissionsList = this.checkList;
      admin.image = this.imgUrl;
      const ret = await this.$API.admin.createAdmin(admin);
      if (ret.code === 200) {
        this.dialogVisible = false;
        this.adminName = "";
        this.password = "";
        this.imgUrl = null;
        this.checkList = [];
        this.$refs.upload.clearFiles();
        this.getOtherAdmin();
        this.$message({
          type: "success",
          message: "创建成功"
        });
      }else{
        this.$message({
          type:'error',
          message:ret.message
        })
      }
    },
    async uploadFile(params) {
      const _file = params.file;
      // 通过 FormData 对象上传文件
      var formData = new FormData();
      formData.append("file", _file);
      const ret = await this.$API.admin.setAdminImage(formData);
      if (ret.code === 200) {
        this.imgUrl = ret.url;
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.adminName = "";
      this.password = "";
      this.imgUrl = null;
      this.checkList = [];
      this.$refs.upload.clearFiles();
    },
    async getOtherAdmin() {
      const ret = await this.$API.admin.getOtherAdmin();
      if (ret.code === 200) {
        this.tableData = ret.adminList;
      }
    }
  },
  mounted() {
    this.getOtherAdmin();
  }
};
</script>

<style lang="less" scoped>
.admin-view {
  .title-container {
    margin-top: 15px;
    .title {
      margin-left: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #909399;
    }
  }
  .table-container {
    margin-left: 10px;
    margin-top: 20px;
  }
}
</style>