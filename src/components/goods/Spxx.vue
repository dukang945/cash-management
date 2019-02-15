<template>
  <div class="contain-box">
    <div class="table-box">
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelAlign"
        size="mini"
        :inline="true"
      >
        <el-form-item label="商品名称">
          <el-input v-model="formLabelAlign.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input v-model="formLabelAlign.productCode"></el-input>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select v-model="formLabelAlign.state">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签">
          <el-select v-model="formLabelAlign.labelId">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-box">
      <div class="function">
        <el-button type="primary" @click="dialogAddVisible = true">新增</el-button>
        <el-dialog title="编辑" :visible.sync="dialogAddVisible">
              <el-form :model="formAdd" :rules="rules" ref="formAdd">
                <el-form-item label="商品名称" label-width="120px" prop="productName">
                  <el-input v-model="formAdd.productName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品条码" label-width="120px" prop="productCode">
                  <el-input v-model="formAdd.productCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单价" label-width="120px" prop="originalPrice">
                  <el-input v-model="formAdd.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="预警量" label-width="120px" prop="warningQuantity">
                  <el-input v-model="formAdd.warningQuantity" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存量" label-width="120px" prop="stockBalance">
                  <el-input v-model="formAdd.stockBalance" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="店铺logo" class="logo-img">
                  <el-upload
                    class="upload-img"
                    action
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :data="imgData"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :http-request="upload"
                  >
                    <img :src="formAdd.productImg" alt class="uploadpic">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="创建时间" label-width="120px" prop="updateTime">
                  <el-input v-model="formAdd.updateTime" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会员价格" label-width="120px" prop="discountPrice">
                  <el-input v-model="formAdd.discountPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签" label-width="120px" prop="labelId">
                  <el-select v-model="formAdd.labelId" placeholder="请选择活动区域">
                    <el-option label='1' value ='1'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" label-width="120px" prop="mark">
                  <el-input v-model="formAdd.mark" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAdd('formAdd')">确 定</el-button>
              </div>
            </el-dialog>
        <el-dialog title="订单详情" :visible.sync="dialogTableVisible" append-to-body></el-dialog>
        <el-button @click="handleExport">导出数据</el-button>
      </div>
      <el-table :data="orderList" border style="width: 100%" id="out-table" stripe>
        <el-table-column label="操作" width="270" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleClick(scope.$index, scope.row)" class="handle">详情</el-button>
            <el-dialog title="编辑" :visible.sync="dialogFormVisible">
              <el-form :model="formEdit" :rules="rules" ref="formEdit">
                <el-form-item label="商品名称" label-width="120px" prop="productName">
                  <el-input v-model="formEdit.productName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品条码" label-width="120px" prop="productCode">
                  <el-input v-model="formEdit.productCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="单价" label-width="120px" prop="originalPrice">
                  <el-input v-model="formEdit.originalPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="预警量" label-width="120px" prop="warningQuantity">
                  <el-input v-model="formEdit.warningQuantity" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="库存量" label-width="120px" prop="stockBalance">
                  <el-input v-model="formEdit.stockBalance" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="店铺logo" class="logo-img">
                  <el-upload
                    class="upload-img"
                    action
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :data="imgData"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :http-request="upload"
                  >
                    <img :src="formEdit.productImg" alt class="uploadpic">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <!-- <el-form-item label="创建时间" label-width="120px" prop="updateTime">
                  <el-input v-model="formEdit.updateTime" autocomplete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="会员价格" label-width="120px" prop="discountPrice">
                  <el-input v-model="formEdit.discountPrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标签" label-width="120px" prop="labelId">
                  <el-select v-model="formEdit.lableId" placeholder="请选择活动区域">
                    <el-option label='1' value ='1'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" label-width="120px" prop="mark">
                  <el-input v-model="formEdit.mark" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
              </div>
            </el-dialog>
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" class="handle">编辑</el-button>
            <el-button
              size="small"
              @click="handleOnline(scope.$index, scope.row)"
              class="handle"
              v-if="scope.row.state==1"
            >启用</el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleOnline(scope.$index, scope.row)"
              class="handle"
              v-else
            >禁止</el-button>
            <el-button size="small" class="handle">标签</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="序号" align="center"></el-table-column>
        <el-table-column prop="productCode" label="商品条码" width="150" align="center"></el-table-column>
        <el-table-column prop="productImg" label="商品图片" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productImg" alt class="show-pic">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName" width="250" align="center">
          <!-- <template slot-scope="scope" v-else-if="scope.row.payState==1">支付成功</template>
          <template slot-scope="scope" v-else-if="scope.row.payState==0">未支付</template>-->
        </el-table-column>
        <el-table-column prop="specifications" label="商品规格" align="center"></el-table-column>
        <el-table-column label="单价" prop="originalPrice"></el-table-column>
        <el-table-column prop="discountPrice" label="会员价格" align="center"></el-table-column>
        <el-table-column prop="buyingPrice" label="进货单价" align="center"></el-table-column>
        <el-table-column prop="warningQuantity" label="预警量" align="center"></el-table-column>
        <el-table-column prop="stockBalance" label="库存量" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="small" v-if="scope.row.state==1">上架</el-button>
            <el-button type="danger" size="small" v-if="scope.row.state==0">下架</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="标签" align="center"></el-table-column>

        <el-dialog title="订单详情" :visible.sync="dialogTableVisible" append-to-body>
          <table width="200" border="1" cellspacing="0" class="detail-table">
            <tr>
              <th class="table-head">商品名称</th>
              <td>{{tableForm.productName}}</td>
              <th rowspan="2">商品图片</th>
              <td rowspan="2">
                <img :src="tableForm.productImg" alt>
              </td>
            </tr>
            <tr>
              <th>商品条码</th>
              <td>{{tableForm.productCode}}</td>
            </tr>
            <tr>
              <th>单价</th>
              <td>{{tableForm.originalPrice}}</td>
              <th>会员价格</th>
              <td>{{tableForm.discountPrice}}</td>
            </tr>
            <tr>
              <th>进货单价</th>
              <td>{{tableForm.buyingPrice}}</td>
              <th>创建时间</th>
              <td>{{tableForm.updateTime}}</td>
            </tr>
            <tr>
              <th>预警量</th>
              <td>{{tableForm.warningQuantity}}</td>
              <th>库存量</th>
              <td>{{tableForm.stockBalance}}</td>
            </tr>
            <tr>
              <th>标签</th>
              <td>{{tableForm.labelName}}</td>
              <th>备注</th>
              <td>{{tableForm.mark}}</td>
            </tr>
          </table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary">确 定</el-button>
          </div>
        </el-dialog>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 24]"
        :current-page="formLabelAlign.page"
        :page-size="12"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import OSS from "ali-oss";
export default {
  data() {
    return {
      total: 1,
      dataPick: "",
      idx: -1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogAddVisible: false,
      orderList: [],
      detailList: [],
      fileList: [],
      imgData: {},
      tableForm: {},
      formEdit: {},
      formAdd: {
        labelId:''
      },
      formLabelAlign: {
        productCode: "",
        productName: "",
        state: "",
        labelId: "",
        page: 1,
        rows: 12
      },
      rules: {
        productName: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        productCode: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        specifications: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        originalPrice: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        discountPrice: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        buyingPrice: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        warningQuantity: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        stockBalance: [
          { required: true, message: "请填写完整信息", trigger: "blur" }
        ],
        mark: [{ required: true, message: "请填写完整信息", trigger: "blur" }],
        labelId: [
          { required: true, message: "请填写完整信息", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
  },
  methods: {
    //获取列表数据
    getOrderList(page, rows) {
      if (this.formLabelAlign.time) {
        this.formLabelAlign.startTime = this.formLabelAlign.time[0];
        this.formLabelAlign.endTime = this.formLabelAlign.time[1];
      }

      this.$axios
        .post(
          "http://192.168.12.226:8401/management/product/selectProductList",
          this.$qs.stringify(this.formLabelAlign)
        )
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.orderList = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    //查看详情
    handleClick(index, rows) {
      // console.log(rows)
      this.dialogTableVisible = true;
      this.$axios
        .post(
          "/management/product/selectProductDetail",
          this.$qs.stringify({ id: rows.id })
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res.data.data);
            this.tableForm = res.data.data;
          }
        });
    },
    //启用禁用
    handleOnline(index, rows) {
      this.$axios
        .post(
          "http://192.168.12.226:8401/management/product/setState",
          this.$qs.stringify({ id: rows.id, state: rows.state == 0 ? 1 : 0 })
        )
        .then(res => {
          if (res.status == 200) {
            this.$confirm(`是否${rows.state == 0 ? "启用" : "禁用"}`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.getOrderList(
                  this.formLabelAlign.page,
                  this.formLabelAlign.rows
                );
                this.$message({
                  type: "success",
                  message: `${rows.state == 0 ? "启用" : "禁用"}成功!`
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消"
                });
              });
          }
        });
    },
    //新增
    handleAdd(formAdd) {
      this.$refs[formAdd].validate((valid) => {
          if (valid) {
            this.$axios.post('http://192.168.12.226:8401/management/product/saveProduct',this.$qs.stringify(this.formAdd)).then(res=>{
              if(res.status ==200){
                this.$message({
              type: "success",
              message: "添加成功"
            });
            this.dialogAddVisible =false;
            this.formAdd ={}
            this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //编辑
    handleEdit(index, rows) {
      this.dialogFormVisible = true;
      this.idx = rows.id;
      this.$axios
        .post(
          `http://192.168.12.226:8401/management/product/selectProductDetail?id=${
            rows.id
          }`
        )
        .then(res => {
          if (res.status == 200) {
            this.formEdit = res.data.data;
          }
        });
    },
    // 保存编辑
    saveEdit() {
      this.$axios
        .post(
          `http://192.168.12.226:8401/management/product/saveProduct?id=${
            this.idx
          }`,
          this.$qs.stringify({
            id: this.formEdit.id,
            productCode: this.formEdit.productCode,
            productImg: this.formEdit.productImg,
            productName: this.formEdit.productName,
            specifications: this.formEdit.specifications,
            originalPrice: this.formEdit.originalPrice,
            discountPrice: this.formEdit.discountPrice,
            buyingPrice: this.formEdit.buyingPrice,
            warningQuantity: this.formEdit.warningQuantity,
            stockBalance: this.formEdit.stockBalance,
            mark: this.formEdit.mark,
            labelId: this.formEdit.labelId
          })
        )
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "编辑成功"
            });
            this.dialogFormVisible =false;
            this.formEdit ={}
            this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
          }
        });
    },
    // 查询
    handleSearch() {
      console.log(this.formLabelAlign);
      this.formLabelAlign.startTime = "";
      this.formLabelAlign.endTime = "";
      this.formLabelAlign.page = 1;
      this.formLabelAlign.rows = 10;
      this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
    },
    //重置
    handleReset() {
      this.formLabelAlign = {
        outTradeNo: "",
        payState: "",
        time: [],
        payWay: "",
        page: 1,
        rows: 10
      };
    },
    //导出数据
    handleExport() {
      window.location.href = `http://106.14.175.162:8401/management/product/createProductExcel?productCode=${
        this.formLabelAlign.productCode
      }&productName=${this.formLabelAlign.productName}&state=${
        this.formLabelAlign.state
      }&labelId=${this.formLabelAlign.labelId}`;
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
    upload(item) {
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
       this.formAdd.productImg = res.url
     }) // OSS上传
    },
    //分页
    handleSizeChange(val) {
      this.formLabelAlign.rows = val;
      this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
    },
    handleCurrentChange(val) {
      this.formLabelAlign.page = val;
      this.getOrderList(this.formLabelAlign.page, this.formLabelAlign.rows);
    }
  }
};
</script>

<style >
.show-pic {
  height: 30px;
}
.detail-table {
  border-collapse: collapse;
  width: 700px;
  border: #dcdfe6;
  font-size: 14px;
}
.detail-table tr {
  height: 50px;
  color: #606266;
}
.detail-table th {
  width: 228px;
  background-color: #f2f6fc;
  color: #606266;
  font-weight: normal;
}
.detail-table td {
  width: 445px;
  color: #606266;
  padding-left: 33px;
}
.detail-table td img {
  width: 110px;
  height: 56px;
}
.el-dialog__body {
  text-align: left;
}
.upload-img {
  padding-left: 20px;
}
.el-dialog .el-form {
  width: 460px;
}
.uploadpic {
  width: 63px;
  height: 38px;
  vertical-align: top;
}
.logo-img{
  margin-left:50px;
}
</style>