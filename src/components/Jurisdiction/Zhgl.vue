<template>
  <div class="contain-box">
    <div class="table-box">
      <el-form
        label-position="right"
        label-width="80px"
        :model="formLabelSearch"
        size="mini"
        :inline="true"
      >
        <el-form-item label="姓名">
          <el-select v-model="formLabelSearch.phone" placeholder="请选择姓名/手机号">
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.real_name"
              :value="item.phone"
            >
              <span style="float: left">{{ item.real_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phone }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号">
          <el-input placeholder="请输入账号" v-model="formLabelSearch.loginAccount"></el-input>
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input placeholder="请输入角色名称" v-model="formLabelSearch.roleName"></el-input>
        </el-form-item>
        <el-form-item label="分配状态">
          <el-select v-model="formLabelSearch.payWay">
            <el-option label="全部" value></el-option>
            <el-option label="未分配" value="1"></el-option>
            <el-option label="已分配" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="formLabelSearch.state">
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
        <el-button size="small" type="primary" @click="handleExport">导出数据</el-button>
        <el-button size="small" type="primary" @click="dialogAddVisible = true">新增</el-button>
        <el-dialog title="新增" :visible.sync="dialogAddVisible" >
          <el-form
            :model="formLabelAdd"
            :rules="rules"
            ref="formLabelAdd"
            label-position="right"
            label-width="80px"
          >
            <el-form-item label="账号" prop="loginAccount">
              <el-input v-model="formLabelAdd.loginAccount" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPassword">
              <el-input v-model="formLabelAdd.loginPassword"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="formLabelAdd.realName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="formLabelAdd.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleId">
              <el-select v-model="formLabelAdd.roleId">
                <el-option :label="item.roleName" :value="item.id" v-for="item in roleList" :key='item.id'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAddVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAdd('formLabelAdd')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table :data="userList" border style="width: 100%">
        <el-table-column prop="real_name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="login_account" label="账号"></el-table-column>
        <el-table-column label="角色名称" prop="role_name"></el-table-column>
        <el-table-column prop="update_time_str" label="修改时间"></el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==0">禁用</span>
            <span v-else-if="scope.row.state==1">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="success"
              @click="handleClick(scope.$index, scope.row)"
            >{{scope.row.state==0?'启用':"禁用"}}</el-button>
          </template>
        </el-table-column>
         <el-dialog title="编辑" :visible.sync="dialogEditVisible" append-to-body>
          <el-form
            :model="formLabelEdit"
            :rules="rules"
            ref="formLabelEdit"
            label-position="right"
            label-width="80px"
          >
            <el-form-item label="账号" prop="loginAccount">
              <el-input v-model="formLabelEdit.loginAccount" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPassword">
              <el-input v-model="formLabelEdit.loginPassword"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="formLabelEdit.realName"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="formLabelEdit.phone"></el-input>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleId">
              <el-select v-model="formLabelEdit.roleId">
                <el-option :label="item.roleName" :value="item.id" v-for="item in roleList" :key='item.id'></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveEdit('formLabelEdit')">确 定</el-button>
          </div>
        </el-dialog>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20]"
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
      total1:1,
      page:1,
      rows:1,
      idx:-1,
      dataPick: "",
      dialogEditVisible: false,
      dialogAddVisible: false,
      userList: [],
      detailList: [],
      nameList: [],
      roleList:[],
      formLabelAlign: {
        phone: "",
        loginAccount: "",
        roleName: "",
        state: "",
        page: 1,
        rows: 10
      },
      formLabelSearch: {
        phone: "",
        loginAccount: "",
        roleName: "",
        state: "",
        page: 1,
        rows: 10
      },
      formLabelAdd: {},
      formLabelEdit:{},
      rules: {
        loginAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        loginPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
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
    this.getUserList(this.formLabelAlign.page, this.formLabelAlign.rows);
    this.getRoleList(1,10)
  },
  methods: {
    //获取列表数据
    getUserList(page, rows) {
      this.$axios
        .post(
          "/management/sysAccount/selectList",
          this.$qs.stringify(this.formLabelAlign)
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.userList = res.data.data.rows;
            this.nameList = res.data.data.rows;
            this.total = res.data.data.total;
          }
        });
    },
    //获取角色列表
    getRoleList(page,rows){
      this.$axios.post('/management/sysRole/selectList',this.$qs.stringify({
        page,rows
      })).then(res=>{
        console.log(res,1)
        this.roleList = res.data.data.rows
        this.total1 =res.data.data.total
      })
    },
    //新增
    handleAdd(formName) {
      
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/management/sysAccount/add',this.$qs.stringify(this.formLabelAdd)).then(res=>{
              if(res.status==200){
                   this.$message({
                type: "success",
                message: `添加成功!`
              });
              this.dialogAddVisible = false;
              this.getUserList(1,10)
              this.formLabelAdd={}
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
      this.dialogEditVisible = true;
      this.formLabelEdit = {
        loginAccount:rows.login_account,
        loginPassword:rows.login_account,
        realName:rows.real_name,
        phone:rows.phone,
        roleId:rows.role_id,
        accountRoleId:rows.account_role_id,
        id:rows.id
      }
    },
    //确认编辑
    saveEdit(formName){
      console.log(this.formLabelEdit)
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post('/management/sysAccount/edit',this.$qs.stringify(this.formLabelEdit)).then(res=>{
              if(res.status==200){
                   this.$message({
                type: "success",
                message: `编辑成功!`
              });
              this.dialogEditVisible = false;
              this.getUserList(1,10)
              this.formLabelEdit={}
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //启用/禁用
    handleClick(index,row){
      console.log(row)
      this.$axios.post('/management/sysAccount/updateState',this.$qs.stringify({id:row.id,state:row.state==1?0:1})).then(res =>{
        if(res.status == 200){
          this.$message({
            type: "success",
                message: `${row.state==1?'禁用':'启用'}成功!`
              });
          this.getUserList(this.formLabelAlign.page, this.formLabelAlign.rows);
        }
      })

    },
    // 查询
    handleSearch() {
      console.log(this.formLabelAlign);
      this.$axios
        .post(
          "/management/sysAccount/selectList",
          this.$qs.stringify(this.formLabelSearch)
        )
        .then(res => {
          if (res.status == 200) {
            console.log(res);
            this.userList = res.data.data.rows;
            this.total = res.data.data.total;
            this.formLabelAlign = this.formLabelSearch
          }
        });
    },
    //重置
    handleReset() {
      this.formLabelSearch = this.formLabelAlign = {
        phone: "",
        loginAccount: "",
        roleName: "",
        state: "",
        page: 1,
        rows: 10
      };
    },
    //导出数据
    handleExport() {
      window.location.href = `http://106.14.175.162:8401/management/sysAccount/exportExcel?phone=${
        this.formLabelAlign.phone
      }&loginAccount=${this.formLabelAlign.loginAccount}&roleName=${
        this.formLabelAlign.roleName
      }&state=${this.formLabelAlign.state}`;
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