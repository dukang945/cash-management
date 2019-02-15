<template>
  <div class="contain-box">
    <div class="table-box">
      <el-row>
        <el-col :span="12">
          <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="formLabelAlign"
            size="small"
            :rules="rules"
            ref="formLabelAlign"
          >
            <el-form-item label="顶部图片">
              <el-upload
                class="upload-demo"
                action
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :data="imgData"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :http-request="uploadTop"
              >
                <img :src="formLabelAlign.topImg" alt class="uploadpic">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="底部图片">
              <el-upload
                class="upload-demo"
                action
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :data="imgData"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :http-request="uploadBtm"
              >
                <img :src="formLabelAlign.bottomImg" alt class="uploadpic">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="店铺名称" prop="shopName">
              <el-input v-model="formLabelAlign.shopName"></el-input>
            </el-form-item>
            <el-form-item label="店铺地址" prop="shopAddress">
              <el-input v-model="formLabelAlign.shopAddress"></el-input>
            </el-form-item>
            <el-form-item label="店铺电话" prop="phone">
              <el-input v-model="formLabelAlign.phone"></el-input>
            </el-form-item>
            <el-form-item label="广告语" prop="ad">
              <el-input v-model="formLabelAlign.ad" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="自定义文字" prop="remark">
              <el-input v-model="formLabelAlign.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handelEdit()">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <img src alt>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import OSS from "ali-oss";
export default {
  data() {
    return {
      labelPosition: "right",
      fileList: [],
      imgData: {},
      formLabelAlign: {},
      rules: {
        businessName: [
          { required: true, message: "请输入商家名称", trigger: "blur" }
        ],
        shopName: [
          { required: true, message: "请输入店铺名称", trigger: "blur" }
        ],
        shopAddress: [
          { required: true, message: "请输入店铺地址", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        shopAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        ad: [{ required: true, message: "请输入账号", trigger: "blur" }],
        remark: [{ required: true, message: "请输入账号", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getTicket();
  },
  methods: {
    //获取票据信息
    getTicket() {
      this.$axios
        .post(
          "http://192.168.12.226:8401/management/invoiceTemplate/selectDetail"
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.formLabelAlign = res.data.data;
          }
        });
    },
    //修改票据信息
    handelEdit() {
      this.$axios
        .post(
          "/management/invoiceTemplate/save",
          this.$qs.stringify(this.formLabelAlign)
        )
        .then(res => {
          if (res.status == 200) {
            this.getTicket();
            this.$message({
              type: "success",
              message: "修改成功"
            });
          }
        });
    },
    //图片上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      this.imgData.FileName = file.name;
      this.imgData.imgFile = file;
    },
    handleSuccess(res) {
      // console.log(res);
      // this.formLabelAlign.image = res.url;
    },
    uploadTop(item) {
      let client = new OSS({
        region: "oss-cn-shanghai", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz-cash" // 阿里云上存储的 Bucket
      });
      console.log(new Date().valueOf());
      let key =
        new Date().valueOf() +
        "_" +
        sessionStorage.getItem("id") +
        "_" +
        Math.round(Math.random() * 999999) +
        ".jpg"; // 存储路径，并且给图片改成唯一名字
      console.log(key);
      return client.put(key, item.file).then(res => {
        console.log(res.url);
        this.formLabelAlign.topImg = res.url;
      }); // OSS上传
    },
    uploadBtm(item) {
      let client = new OSS({
        region: "oss-cn-shanghai", // 服务器集群地区
        accessKeyId: "LTAIBlmIfZYuFy39", // OSS帐号
        accessKeySecret: "WtLJa4obg3fdExi3DL1v3XhT7LIufv", // OSS 密码
        bucket: "whsxdz-cash" // 阿里云上存储的 Bucket
      });
      console.log(new Date().valueOf());
      let key =
        new Date().valueOf() +
        "_" +
        sessionStorage.getItem("id") +
        "_" +
        Math.round(Math.random() * 999999) +
        ".jpg"; // 存储路径，并且给图片改成唯一名字
      console.log(key);
      return client.put(key, item.file).then(res => {
        console.log(res.url);
        this.formLabelAlign.bottomImg = res.url;
      }); // OSS上传
    }
  }
};
</script>

<style scoped>
.uploadpic {
  width: 63px;
  height: 38px;
  vertical-align: top;
}
</style>