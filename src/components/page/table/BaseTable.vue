<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 表格</el-breadcrumb-item>
                <el-breadcrumb-item>基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
        
            <el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">
				  <el-option key="" label="全部" value=""></el-option>
                <el-option key="1" label="广东省" value="广东省"></el-option>
                <el-option key="2" label="湖南省" value="湖南省"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
				
			
					<el-button type="primary" @click="handleAdd">新增</el-button>
				
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="name" label="姓名" >
            </el-table-column>
            <el-table-column prop="address" label="地址" >
            </el-table-column>
			 <el-table-column prop="date" label="日期" sortable >
            </el-table-column>
			
			            <el-table-column prop="age" label="年龄" >
            </el-table-column>
			
		<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			
			
			
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
</el-table-column>
</el-table>



<!--编辑界面-->
<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
	<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
		<el-form-item label="姓名" prop="name">
			<el-input v-model="editForm.name" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="editForm.sex">
				<el-radio class="radio" label="1">男</el-radio>
				<el-radio class="radio" label="0">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="年龄">
			<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
		</el-form-item>
		<el-form-item label="生日">
			<el-date-picker type="date" placeholder="选择日期" v-model="editForm.date"></el-date-picker>
		</el-form-item>
		<el-form-item label="地址">
			<el-input type="textarea" v-model="editForm.address"></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click.native="editFormVisible = false">取消</el-button>
		<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
	</div>
</el-dialog>

<!--新增界面-->
<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
	<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
		<el-form-item label="姓名" prop="name">
			<el-input v-model="addForm.name" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="性别">
			<el-radio-group v-model="addForm.sex">
				<el-radio class="radio" :label="1">男</el-radio>
				<el-radio class="radio" :label="0">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="年龄">
			<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
		</el-form-item>
		<el-form-item label="生日">
			<el-date-picker type="date" placeholder="选择日期" v-model="addForm.date"></el-date-picker>
		</el-form-item>
		<el-form-item label="地址">
			<el-input type="textarea" v-model="addForm.address"></el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button @click.native="addFormVisible = false">取消</el-button>
		<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
	</div>
</el-dialog>


<div class="pagination">
	<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll" style="float:left">批量删除</el-button>
	<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="500">
	</el-pagination>
</div>
</div>
</template>

<script>
	import {
		getUserList
	} from 'api/api';
	export default {
		data() {
			return {

				tableData: [],
				cur_page: 1,
				multipleSelection: [],
				select_cate: '',
				select_word: '',
				del_list: [],
				is_search: false,

				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					date: '',
					address: ''
				},

				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					date: '',
					address: ''
				}
			}
		},
		created() {
			//            this.getData();
			this.getUser();
		},
		computed: {
			data() {
				const self = this;
				return self.tableData.filter(function(d) {
					let is_del = false;
					for (let i = 0; i < self.del_list.length; i++) {
						if (d.name === self.del_list[i].name) {
							is_del = true;
							break;
						}
					}
					if (!is_del) {
						if (d.address.indexOf(self.select_cate) > -1 &&
							(d.name.indexOf(self.select_word) > -1 ||
								d.address.indexOf(self.select_word) > -1)
						) {
							return d;
						}
					}
				})
			}
		},
		methods: {


			//获取用户列表
			getUser: function() {
				let para = {

				};
				this.loading = true;

				getUserList(para).then((res) => {
					this.users = res;
					console.log(res)
				});
			},



			//性别显示转换
			formatSex: function(row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//分页
			handleCurrentChange(val) {
				this.cur_page = val;
				this.getData();
			},
			//列表数据
			getData() {
				let self = this;
				if (process.env.NODE_ENV === 'development') {
					self.url = '/ms/table/list';
				};
				self.$axios.post(self.url, {
					page: self.cur_page
				}).then((res) => {
					self.tableData = res.data.list;

					console.log(JSON.stringify(res.data));
				})
			},
			//搜索
			search() {
				this.is_search = true;

			},

			//编辑
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				//                this.$message('编辑第'+(index+1)+'行');
			},

			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},

			//删除
			handleDelete(index, row) {
				this.$message.error('删除第' + (index + 1) + '行');
			},
			delAll() {

				const self = this,
					length = self.multipleSelection.length;
				let str = '';
				console.log(self.multipleSelection);

				self.del_list = self.del_list.concat(self.multipleSelection);
				for (let i = 0; i < length; i++) {
					str += self.multipleSelection[i].name + ' ';
				}
				self.$message.error('删除了' + str);
				self.multipleSelection = [];
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			}
		}
	}

</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}
	
	.handle-select {
		width: 120px;
	}
	
	.handle-input {
		width: 300px;
		display: inline-block;
	}

</style>
