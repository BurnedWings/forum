<template>
  <div>
    <div class="editBackground-container" @click="closeEditView"></div>
    <div v-if="isSearchContainerShow" class="edit-container">
      <div class="title">
        Crop your new profile picture
        <i
          class="search-container-icon el-icon-close"
          @click="closeEditView"
        ></i>
      </div>
      <div class="title-line"></div>
      <div class="photo-view">
        <img id="myImage" :src="updateUrl" alt />
      </div>
      <div class="edit-button" @click="sendAvatar">Set new profile picture</div>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  name: "EditPicture",
  data() {
    return {
      isSearchContainerShow: false,
      updateUrl: "",
      theImgDataToSend: ""
    };
  },
  methods: {
    initCropper(image) {
      const cropper = new Cropper(image, {
        background: false,
        aspectRatio: 1,
        viewMode: 2,
        zoomable: false,
        ready: () => {
          cropper
            .getCroppedCanvas({
              maxWidth: 500,
              maxHeight: 500,
              minWidth: 200,
              minHeight: 200,
              imageSmoothingEnabled: true,
              imageSmoothingQuality: "medium"
            })
            .toBlob(blob => {
              const formData = new FormData();
              formData.append("files", blob, "example.png");

              this.theImgDataToSend = { formData };
            });
        },
        cropend: () => {
          cropper
            .getCroppedCanvas({
              maxWidth: 1000,
              maxHeight: 1000,
              minWidth: 100,
              minHeight: 100,
              imageSmoothingEnabled: true,
              imageSmoothingQuality: "medium"
            })
            .toBlob(blob => {
              const formData = new FormData();
              formData.append("files", blob, "example.png");
              this.theImgDataToSend = { formData };
            });
        }
      });
    },
    closeEditView() {
      let file = document.getElementById("imgReader");
      file.value = "";
      const searchBackground = document.querySelector(
        ".editBackground-container"
      );
      searchBackground.classList.remove("editBackground-container-change");
      const searchContainer = document.querySelector(".edit-container");
      searchContainer.style.animation = "closeSearchContainer 0.5s forwards";
      setTimeout(() => {
        searchBackground.style.height = 0 + "vh";
        this.isSearchContainerShow = false;
      }, 300);
    },
    async sendAvatar() {
      try {
        const ret = await this.$API.system.uploadSwiper(
          this.theImgDataToSend.formData
        );
        if (ret.code === 200) {
          this.closeEditView()
          this.$bus.$emit("refSwiper")
          this.$message({
            type: "success",
            message: "上传成功"
          });
        }
      } catch (error) {
        // this.$message({})
      }
    },
    // async sendAvatar() {
    //   try {
    //     const ret = await this.$API.user.updateUserAvatar(
    //       this.theImgDataToSend.formData
    //     );
    //     if (ret.code === 200) {
    //       window.location.reload();
    //     }
    //   } catch (error) {
    //     // this.$message({})
    //   }
    // },
    showEditView() {
      const hei = document.body.clientHeight;
      const searchBackground = document.querySelector(
        ".editBackground-container"
      );
      searchBackground.style.height = 100 + "vh";
      searchBackground.classList.add("editBackground-container-change");
      this.isSearchContainerShow = true;
      setTimeout(() => {
        const image = document.getElementById("myImage");
        this.initCropper(image);
      }, 1);
    }
  },
  mounted() {
    this.$bus.$on("showEdit", (data, imgName) => {
      this.showEditView();
      this.updateUrl = data;
    });
  }
};
</script>

<style lang="less">
//修改默认样式
.cropper-modal {
  background-color: #000;
  opacity: 0.6;
}
.cropper-face {
  background-color: transparent;
}
.cropper-view-box {
  border-radius: 50%;
}

.setting-view {
  display: flex;
  justify-content: center;
  transition: all 0.5s;
  background-color: white;
  min-height: 800px;
  // .editBackground-container {
  //   opacity: 0;
  //   width: 100%;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   position: absolute;
  //   z-index: 1031;
  //   transition: opacity 0.5s;
  // }

  // .edit-container {
  //   width: 450px;
  //   height: 485px;
  //   background-color: var(--theme_inner_bg_color);
  //   position: fixed;
  //   z-index: 1032;
  //   border: 0;
  //   border-radius: 0.125rem;
  //   -webkit-box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%),
  //     0 4px 15px 0 rgb(0 0 0 / 15%);
  //   box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  //   left: 50%;
  //   transform: translateX(-50%);
  //   transition: all 0.5s;
  //   animation-name: showSearchContainer;
  //   animation-duration: 0.5s;
  //   animation-fill-mode: forwards;
  //   .title {
  //     font-size: 14px;
  //     font-weight: 600;
  //     text-align: center;
  //     margin-top: 20px;
  //     margin-bottom: 10px;
  //     .search-container-icon {
  //       font-weight: 600;
  //       position: absolute;
  //       right: 10px;
  //       top: 23px;
  //       cursor: pointer;
  //     }
  //     .search-container-icon:hover {
  //       transition: color 0.5s;
  //       color: rgb(48, 169, 222);
  //     }
  //   }
  //   .title-line {
  //     width: 100%;
  //     height: 1px;
  //     background-color: var(--theme_search_line_color);
  //   }
  //   .photo-view {
  //     width: 100%;
  //     height: 450px;
  //     background-color: var(--theme_inner_bg_color);
  //     overflow-y: auto;
  //     overflow-x: hidden;
  //     margin-bottom: 15px;
  //     img {
  //       width: 100%;
  //     }
  //   }
  //   .edit-button {
  //     transition: all 0.3s;
  //     width: 95%;
  //     height: 40px;
  //     margin: 0 auto;
  //     color: white;
  //     border-radius: 5px;
  //     line-height: 40px;
  //     text-align: center;
  //     background-color: rgb(66, 133, 244);
  //     border-color: rgb(66, 133, 244);
  //     cursor: pointer;
  //   }
  //   .edit-button:hover {
  //     background-color: rgb(63, 130, 238);
  //     border-color: rgb(63, 127, 230);
  //   }
  // }

  // .editBackground-container-change {
  //   opacity: 1;
  // }
  .setting-container {
    width: 100%;
    height: 600px;
    position: relative;
    top: 70px;
    .my-navbar {
      width: 83%;
      height: 70px;
      margin: 0 auto 0 auto;
      line-height: 70px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-left: 10px;
      }
      .user-name {
        font-size: 18px;
        position: absolute;
        top: -10px;
        margin-left: 10px;
      }
      .message {
        position: absolute;
        top: 10px;
        margin-left: 10px;
        font-weight: 100;
      }
      button {
        position: absolute;
        right: 10%;
        top: 30px;
        height: 25px;
        line-height: 10px;
        background-color: var(--theme_userView_btn_bg);
        color: var(--theme_font_color);
        border: var(--theme_userView_btn_border);
        border: 1px solid rgba(240, 246, 252, 0.1);
        border-radius: 6px;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      }
      button:hover {
        background-color: var(--theme_userView_btn_bg_hover);
      }
    }

    .right-part {
      width: 73%;
      height: 600px;
      position: absolute;
      right: 0;
    }
  }
}
@keyframes closeSearchContainer {
  from {
    top: 70px;
    opacity: 1;
  }
  to {
    top: 30px;
    opacity: 0;
  }
}
</style>
<style lang="less" scoped>
@keyframes showSearchContainer {
  from {
    top: 30px;
    opacity: 0;
  }
  to {
    top: 70px;
    opacity: 1;
  }
}

.editBackground-container {
  opacity: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 1031;
  transition: opacity 0.5s;
}
.edit-container {
  width: 450px;
  height: 485px;
  background-color: white;
  position: fixed;
  z-index: 1032;
  border: 0;
  border-radius: 0.125rem;
  -webkit-box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%),
    0 4px 15px 0 rgb(0 0 0 / 15%);
  box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.5s;
  animation-name: showSearchContainer;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  .title {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 10px;
    .search-container-icon {
      font-weight: 600;
      position: absolute;
      right: 10px;
      top: 23px;
      cursor: pointer;
    }
    .search-container-icon:hover {
      transition: color 0.5s;
      color: rgb(48, 169, 222);
    }
  }
  .title-line {
    width: 100%;
    height: 1px;
    background-color: var(--theme_search_line_color);
  }
  .photo-view {
    width: 100%;
    height: 450px;
    background-color: var(--theme_inner_bg_color);
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 15px;
    img {
      width: 100%;
    }
  }
  .edit-button {
    transition: all 0.3s;
    width: 95%;
    height: 40px;
    margin: 0 auto;
    color: white;
    border-radius: 5px;
    line-height: 40px;
    text-align: center;
    background-color: rgb(66, 133, 244);
    border-color: rgb(66, 133, 244);
    cursor: pointer;
  }
  .edit-button:hover {
    background-color: rgb(63, 130, 238);
    border-color: rgb(63, 127, 230);
  }
}
.editBackground-container-change {
  opacity: 1;
}
</style>