<template>
  <div class="status-container">
    <div class="switch-container">
      <div class="switch-item">
        <span>所有用户</span>
        <el-switch @change="changeZero" v-model="value0"></el-switch>
      </div>
      <div class="switch-item">
        <span>已禁言用户</span>
        <el-switch @change="changeOne" v-model="value1"></el-switch>
      </div>
      <div class="switch-item">
        <span>未禁言用户</span>
        <el-switch @change="changeTwo" v-model="value2"></el-switch>
      </div>

      <el-popconfirm @confirm="forbidAllUser" style="margin-right:10px;" title="你确定要禁言所有用户嘛">
        <el-button
          style="float:right;margin-right:30px;"
          slot="reference"
          size="mini"
          type="danger"
        >全部禁言</el-button>
      </el-popconfirm>
      <el-popconfirm
        @confirm="cancelForbidAllUser"
        style="margin-right:10px;"
        title="你确定要解除所有用户禁言嘛"
      >
        <el-button
          style="float:right;margin-right:10px;"
          slot="reference"
          size="mini"
          type="primary"
        >解除全部禁言</el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" class="status-table" style="width: 100%;">
      <el-table-column prop="image" label="头像" width="120">
        <template slot-scope="scope">
          <img style="width: 50%;border-radius: 50%;" :src="$myBaseUrl+scope.row.image" alt />
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="注册日期" width="130">
        <template slot-scope="scoped">
          <span>{{$dayjs(scoped.row.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户昵称" width="130"></el-table-column>
      <el-table-column prop="email" label="用户邮箱" width="200"></el-table-column>
      <el-table-column prop="bio" label="个性签名" width="260">
        <template slot-scope="scope">
          <div class="bio-container">
            <span>{{scope.row.bio}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="violateCount" label="违规次数" width="120"></el-table-column>
      <el-table-column prop="status" label="用户状态" width="160">
        <template slot-scope="scoped">{{scoped.row.status===0?'正常':'禁言'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-popconfirm
            @confirm="cancelViolate(scope.row._id)"
            style="margin-right:10px;"
            title="你确定要解除该用户禁言嘛"
          >
            <el-button
              slot="reference"
              :disabled="scope.row.status===0"
              size="mini"
              type="primary"
            >解除禁言</el-button>
          </el-popconfirm>
          <el-popconfirm @confirm="violateTheUser(scope.row._id)" title="你确定要将该用户禁言嘛">
            <el-button
              slot="reference"
              :disabled="scope.row.status===1"
              size="mini"
              type="danger"
            >禁言</el-button>
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
      :total="totalUser"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "Status",
  computed: {
    targetUser() {
      return this.$route.params.userId;
    }
  },
  data() {
    return {
      value1: false,
      value2: false,
      value0: false,
      disabledOne: false,
      disabledTwo: false,
      tableData: [],
      totalUser: 0,
      currentPage: null
    };
  },
  methods: {
    changeOne(val) {
      if (val) {
        this.currentPage = null
        this.value0 = false;
        this.value2 = false;
        this.getUserInfoList(2);
      } else {
        this.value2 = true;
        this.getUserInfoList(1);
      }
    },
    changeTwo(val) {
      if (val) {
        this.currentPage = null
        this.value0 = false;
        this.value1 = false;
        this.getUserInfoList(1);
      } else {
        this.value1 = true;
        this.getUserInfoList(2);
      }
    },
    changeZero(val) {
      if (val) {
        this.value1 = false;
        this.value2 = false;
        this.getUserInfoList();
      }
    },
    //取消禁言
    async cancelViolate(val) {
      const ret = await this.$API.user.cancelForbidTheUser(val);
      if (ret.code === 200) {
        if(this.value1){
          return this.getUserInfoList(2);
        }
        if(this.value2){
          return this.getUserInfoList(1);
        }
        this.getUserInfoList()
      }
    },
    //禁言
    async violateTheUser(val) {
      const ret = await this.$API.user.forbidTheUser(val);
      if (ret.code === 200) {
        if(this.value1){
          return this.getUserInfoList(2);
        }
        if(this.value2){
          return this.getUserInfoList(1);
        }
        this.getUserInfoList()
      }
    },
    //获取用户列表
    async getUserInfoList(status) {
      let ret;
      if (status) {
        ret = await this.$API.user.getUserInfoList(null, status);
      } else {
        if (this.currentPage) {
          ret = await this.$API.user.getUserInfoList(this.currentPage - 1);
        } else {
          ret = await this.$API.user.getUserInfoList();
        }
      }
      if (ret.code === 200) {
        this.tableData = ret.userList;
        this.totalUser = ret.userCount;
      }
    },
    //分页
    async handleCurrentChange(val) {
      this.currentPage = val;
      const ret = await this.$API.user.getUserInfoList(val - 1);
      if (ret.code === 200) {
        this.tableData = ret.userList;
      }
    },
    //全部禁言
    async forbidAllUser() {
      const ret = await this.$API.user.forbidAllUser();
      if (ret.code === 200) {
        this.getUserInfoList();
      }
    },
    //取消全部禁言
    async cancelForbidAllUser() {
      const ret = await this.$API.user.cancelForbidAllUser();
      if (ret.code === 200) {
        this.getUserInfoList();
      }
    },
    async getOneUserInfo(userId){
      const ret = await this.$API.user.getOneUserInfo(userId)
      if(ret.code===200){
        this.tableData = [ret.user]
        this.totalUser = 1
      }
    }
  },
  mounted() {
    
    if(this.$route.params.userId){
      this.getOneUserInfo(this.$route.params.userId)
    }else{
      this.getUserInfoList();
    }
  }
};
</script>

<style lang='less' scoped>
.status-container {
  .switch-container {
    margin-left: 15px;
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
    margin-left: 15px;
    margin-top: 15px;
    margin-bottom: 25px;
    .bio-container {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      display: -webkit-box;
    }
  }
  .my-pagination {
    margin-left: 40%;
  }
}
</style>