<template>
  <div class="contain-box">
    <div class="table-box">
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelAlign"
        :inline="true"
      >
        <el-form-item label="订单号:">
          <el-input v-model="formLabelAlign.outTradeNo"></el-input>
        </el-form-item>
        <el-form-item label="交易状态:">
          <el-select v-model="formLabelAlign.payState">
            <el-option label="全部" value></el-option>
            <el-option label="已支付" value="1"></el-option>
            <el-option label="未支付" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易时间:">
          <el-date-picker
            v-model="formLabelAlign.time"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-select v-model="formLabelAlign.payWay">
            <el-option label="全部" value></el-option>
            <el-option label="微信" value="1"></el-option>
            <el-option label="支付宝" value="0"></el-option>
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
        <el-button size="small" type="primary" @click="handleExport">导出数据</el-button>
      </div>
      <el-table :data="orderList" border style="width: 100%" id="out-table" stripe>
        <el-table-column prop="outTradeNo" label="订单号" width="260"></el-table-column>
        <el-table-column prop="createTime" label="交易时间" width="160"></el-table-column>
        <el-table-column prop="totalAmount" label="价格"></el-table-column>
        <el-table-column label="交易状态">
          <template slot-scope="scope">
            <span v-if="scope.row.payState==1">支付成功</span>
            <span v-else-if="scope.row.payState==-1">支付失败</span>
            <span v-else-if="scope.row.payState==0">未支付</span>
          </template>
          <!-- <template slot-scope="scope" v-else-if="scope.row.payState==1">支付成功</template>
          <template slot-scope="scope" v-else-if="scope.row.payState==0">未支付</template>-->
        </el-table-column>
        <el-table-column prop="payTotalAmount" label="实收款"></el-table-column>
        <el-table-column label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.payWay==0">支付宝</span>
            <span v-else-if="scope.row.payWay==1">微信</span>
            <span v-else-if="scope.row.payWay==-1">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="handleClick(scope.$index, scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-dialog title="订单详情" :visible.sync="dialogTableVisible" append-to-body>
          <el-table :data="detailList">
            <el-table-column property="outTradeNo" label="订单号" ></el-table-column>
            <el-table-column property="payState" label="订单状态" ></el-table-column>
            <el-table-column property="createBy" label="购买用户"></el-table-column>
            <el-table-column property="tel" label="手机号"></el-table-column>
            <el-table-column property="totalAmount" label="费用"></el-table-column>
            <el-table-column property="createTime" label="下单时间"></el-table-column>
          </el-table>
        </el-dialog>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[12, 24]"
        :current-page="formLabelAlign.page"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 1,
      dataPick: "",
      dialogTableVisible:false,
      orderList: [],
      detailList:[],
      formLabelAlign: {
        outTradeNo: "",
        payState: "",
        time: [],
        payWay: "",
        page: 1,
        rows: 12
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
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
          "/management/order/selectOrder",
          this.$qs.stringify(this.formLabelAlign)
        )
        .then(res => {
          if (res.status == 200) {
            this.orderList = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    //查看详情
    handleClick(index, rows) {

      // console.log(rows)
      // this.dialogTableVisible =true
      // this.$axios.post('/management/order/selectOrderDetail',this.$qs.stringify({outTradeNo:rows.outTradeNo})).then(res=>{
      //   if(res.status==200){
      //     console.log(res.data.data)
      //     this.detailList.concat(res.data.data.orderDetail)
      //     console.log(this.detailList)
      //   }
      // })
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
      if (!this.formLabelAlign.time[0]) {
        this.formLabelAlign.time[0] = "";
        this.formLabelAlign.time[1] = "";
      }
      window.location.href = `http://106.14.175.162:8401/management/order/exportOrderExcel?payWay=${
        this.formLabelAlign.payWay
      }&outTradeNo=${this.formLabelAlign.outTradeNo}&payState=${
        this.formLabelAlign.payState
      }&startTime=${this.formLabelAlign.time[0]}&endTime=${
        this.formLabelAlign.time[1]
      }`;
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

<style scoped>
</style>