<template>
  <div class="images-container">
    <EditPicture></EditPicture>
    <div class="right-top-container">
      <el-carousel :interval="3000" indicator-position="outside">
        <el-carousel-item v-for="(item,index) in tableData" :key="item._id">
          <el-image style="width:100%;height:100%;" :src="$myBaseUrl+item.image" fit="cover"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-table :data="tableData" class="status-table" style="width: 1000px;margin-left:200px;">
      <el-table-column prop="createdAt" label="更新日期" width="200">
        <template slot-scope="scoped">
          <span>{{$dayjs(scoped.row.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="图片预览" width="180">
        <template slot-scope="scope">
          <!-- <img style="width: 30%;" :src="$myBaseUrl+scope.row.image" alt /> -->
          <el-image
            style="width: 33%;"
            :src="$myBaseUrl+scope.row.image"
            :preview-src-list="[$myBaseUrl+scope.row.image]"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column  label="相关描述" width="200">
        <template slot-scope="scope">
          {{scope.row.description?scope.row.description:'暂无'}}
        </template>
      </el-table-column>
      <el-table-column prop="clickCount" label="点赞次数" width="200"></el-table-column>
      <el-table-column class="doColumn" width="220">
        <template slot="header" slot-scope="scope">
          <input
            class="update-input"
            style="display:none;"
            type="file"
            accept="image/*"
            id="imgReader"
            enctype="multipart/form-data"
            @change="loadingImg"
          />
          操作
          <el-button
            @click="showEditView"
            style="margin-left:58px;"
            slot="reference"
            size="mini"
            type="primary"
          >新增</el-button>
        </template>
        <template slot-scope="scope">
          <el-button  style="margin-right:10px;" @click="openTheDialog(scope.row._id)" size="mini" type="primary">修改描述</el-button>
          <el-popconfirm @confirm="removeSwiper(scope.row._id)" title="你确定要将移除该图片嘛">
            <el-button slot="reference" size="mini" type="danger">移除</el-button>
          </el-popconfirm>
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
        ref="messageBox"
        resize="none"
        maxlength="20"
        show-word-limit
        placeholder="请输入内容"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSwiperDescription">保存</el-button></el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import EditPicture from "@/components/EditPicture";
export default {
  name: "Swiper",
  components: {
    EditPicture
  },
  data() {
    return {
      tableData: [],
      dialogVisible:false,
      textarea:'',
      targetSwiper:''
    };
  },
  methods: {
    //移除轮播图
    async removeSwiper(swiperId){
      const ret = await this.$API.system.removeSwiper(swiperId)
      if(ret.code===200){
        this.getSwiper()
        this.$message({
          type:'success',
          message:'移除成功'
        })
      }
    },
    //添加轮播图描述
    async updateSwiperDescription(){
      const ret = await this.$API.system.updateSwiperDescription(this.targetSwiper,this.textarea)
      if(ret.code===200){
        this.dialogVisible = false
        this.textarea = ''
        this.targetSwiper = null
        this.getSwiper()
        this.$message({
          type:'success',
          message:'修改成功~'
        })
      }
    },
    openTheDialog(swiperId){
      this.targetSwiper = swiperId
      this.dialogVisible = true
    },
    //dialog关闭回调
    handleClose(){
      this.targetSwiper = null
      this.dialogVisible = false
      this.textarea = ''
    },
    closeImgBox() {},
    handleRemove() {},
    uploadFile() {},
    //文件上传成功的回调
    loadingImg(event) {
      let reader = new FileReader();
      if (event.target.files[0]) {
        const imgName = event.target.files[0].name;
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = e => {
          let dataURL = reader.result;
          this.$bus.$emit("showEdit", dataURL, imgName);
        };
      }
    },
    //触发input的change事件
    showEditView() {
      if (this.tableData.length >= 4) {
        this.$message({
          type: "warning",
          message: "最多添加四张哦~"
        });
      } else {
        document.querySelector(".update-input").click();
      }
    },
    //获取轮播图
    async getSwiper() {
      const ret = await this.$API.system.getSwiper();
      if (ret.code === 200) {
        this.tableData = ret.swiperList;
      }
    }
  },
  mounted() {
    this.getSwiper();
    this.$bus.$on("refSwiper",()=>{
      this.getSwiper()
    })
  }
};
</script>
<style>
.el-carousel__container {
  height: 220px;
}
</style>
<style lang="less" scoped>
.images-container {
  .right-top-container {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    margin-bottom: 20px;
    transition: all 0.5s;
    width: 260px;
    display: inline-block;
    overflow: hidden;
    height: 250px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
  }
}
</style>