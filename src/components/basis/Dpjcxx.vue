<template>
    <div class="contain-box">
        <div class="info-box">
            <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" size="small" :rules="rules" ref="formLabelAlign">
  <el-form-item label="商家名称" prop="businessName">
    <el-input v-model="formLabelAlign.businessName"></el-input>
  </el-form-item>
  <el-form-item label="店铺名称" prop="shopName">
    <el-input v-model="formLabelAlign.shopName"></el-input>
  </el-form-item>
  <el-form-item label="店铺地址" prop="shopAddress">
    <el-input v-model="formLabelAlign.shopAddress"></el-input>
  </el-form-item>
  <el-form-item label="电话" prop="phone">
    <el-input v-model="formLabelAlign.phone"></el-input>
  </el-form-item>
  <el-form-item label="账号" prop="shopAccount">
    <el-input v-model="formLabelAlign.shopAccount" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password1">
    <el-input v-model="formLabelAlign.shopPassword" type="password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="重复密码" prop="password2">
    <el-input v-model="formLabelAlign.password2" type="password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="店铺logo">
    <el-upload
  class="upload-demo"
  action=""
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :file-list="fileList"
  :data="imgData"
  :before-upload="beforeUpload"
  :on-success="handleSuccess"
  :http-request='upload'
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
  <div slot="tip" class="el-upload__tip">支持png,jpg,jpeg 格式，上传图片像素90*90</div>
</el-upload>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="handleEdit()">保存</el-button>
  </el-form-item>
</el-form>
        </div>
    </div>
</template>

<script>
import OSS from 'ali-oss'
    export default {
        data() {
            var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (this.formLabelAlign.password2 !== '') {
            this.$refs.formLabelAlign.validateField('password2');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formLabelAlign.shopPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
        };
      return {
        labelPosition: 'right',
        fileList:[],
        imgData: {},
        formLabelAlign: {
         
        },
        rules:{
           businessName: [ { required: true, message: '请输入商家名称', trigger: 'blur' }], 
           shopName: [ { required: true, message: '请输入店铺名称', trigger: 'blur' }], 
           shopAddress: [ { required: true, message: '请输入店铺地址', trigger: 'blur' }], 
           phone: [ { required: true, message: '请输入电话', trigger: 'blur' }], 
           shopAccount: [ { required: true, message: '请输入账号', trigger: 'blur' }], 
           shopPassword: [  {required: true, validator: validatePass, trigger: 'blur' }], 
           password2: [  {required: true, validator: validatePass2, trigger: 'blur' }]
        }
      };
    },
    mounted () {
      this.getShopInfo()
    },
    methods: {
      //获取店铺信息
      getShopInfo(){
        this.$axios.post('/management/shop/selectShopDetail').then(res=>{
          if(res.status==200){
            this.formLabelAlign = res.data.data
          }
        })
      },
      //保存修改
      handleEdit(){
        this.$axios.post('http://192.168.12.226:8401/management/shop/save',this.$qs.stringify(this.formLabelAlign)).then(res=>{
          if(res.status ==200){
            console.log(res)
            this.getShopInfo()
            this.$message({
              type: "success",
              message: "修改成功"
            });
          }
        })
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
    upload(item){
      
      let client = new OSS({
      region: 'oss-cn-shanghai', // 服务器集群地区
      accessKeyId: 'LTAIBlmIfZYuFy39', // OSS帐号
      accessKeySecret: 'WtLJa4obg3fdExi3DL1v3XhT7LIufv', // OSS 密码
      bucket: 'whsxdz-cash' // 阿里云上存储的 Bucket
     })
     console.log(new Date().valueOf())
     let key = new Date().valueOf()+ '_' + sessionStorage.getItem('id') +'_'+ Math.round(Math.random()*999999) + '.jpg' // 存储路径，并且给图片改成唯一名字
     console.log(key)
     return client.put(key, item.file).then(res =>{
       console.log(res.url)
     }) // OSS上传
    }
    }
    }
</script>

<style scoped>
    .info-box{
        width: 100%;
        margin-top: 20px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 2px 2px 2px #ccc;
        background-color: #fff;
        border-radius: 5px;
    }
.el-form {
    width: 460px;
}
</style>