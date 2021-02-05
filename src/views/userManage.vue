<template>
	<div class="user">
		<div class="searchs">
			<label for="">关键词:</label>
			<a-input
				placeholder="请输入用户名"
				v-model="queryUser"
			>
				<img
					src="../assets/images/搜索-icon@2x.png"
					alt=""
					slot="suffix"
				>
			</a-input>
			<a-button @click="selectUser">查询</a-button>
			<a-button
				@click="addUserShow"
				class="addUser"
			>添加用户</a-button>
		</div>
		<div
			class="user_manage"
			ref="user_manage"
		>
			<div class="table_area">
				<div
					class="tab_Title"
					style="background:#11519f"
				>
					<table>
						<thead>
							<tr>
								<th style="width:10%">序号</th>
								<th style="width:20%">用户名</th>
								<th style="width:10%">昵称</th>
								<th style="width:10%">操作权限</th>
								<th style="width:20%">用户信息</th>
								<th style="width:15%">电话</th>
								<th style="width:15%">操作</th>
							</tr>
						</thead>
					</table>
				</div>
				<div class="tab_content tableBody">
					<table>
						<tbody>
							<tr
								v-for="(item,index) in this.userList"
								:key="index"
							>
								<td style="width:10%">{{index+1}}</td>
								<td style="width:20%">{{item.userName}}</td>
								<td style="width:10%">{{item.userAlias}}</td>
								<td style="width:10%">{{item.operatingAuth ==1?'有':'无'}}</td>
								<td style="width:20%">{{item.userInfo==''?'无':item.userInfo}}</td>
								<td style="width:15%">{{telFormat(item.phone)}}</td>
								<td style="width:15%">
									<div class="operationClass">
										<span
											class="iconfont"
											style="font-size:1.33rem;margin:0 20px 0 0;cursor:pointer"
											@click="editUserShow(item)"
										>&#xe62f;</span>

										<span
											class="iconfont"
											:class="
										[item.userName==='admin'
										?'btn_disabled': ''
										]"
											style="font-size:1.33rem;cursor:pointer"
											@click="deleteUser(item)"
										>&#xe659;</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<!-- 新增用户 -->
			<a-modal
				:visible="addUserVisible"
				@cancel="handleAdd"
				:centered="true"
				:footer="''"
				title="添加用户"
				:maskClosable="false"
				:getContainer="() => $refs.user_manage"
			>
				<a-form
					:form="addUserForm"
					@submit="addUser"
				>
					<a-form-item label="用户名">
						<a-input
							placeholder="请输入用户名"
							v-decorator="[
                            'userName', // 给表单赋值或拉取表单时，该input对应的key
                            {
                              rules: [
                                { required: true, message: '请输入用户名!' },
                              ],
                            },
                          ]"
						/>
					</a-form-item>
					<a-form-item label="昵称">
						<a-input
							placeholder="请输入昵称"
							v-model="addUserAlias"
						/>
					</a-form-item>
					<a-form-item label="密码">
						<a-input-password
							placeholder="请输入密码"
							v-decorator="[
                            'passWord', // 给表单赋值或拉取表单时，该input对应的key
                            {
                              rules: [
                                { required: true, message: '请输入密码!' },
                              ],
                            },
                          ]"
						/>
					</a-form-item>
					<a-form-item label="访问权限">
						<div class="visit">
							<div class="visitHead">
								<a-checkbox
									:indeterminate="indeterminate"
									:checked="checkAll"
									@change="onCheckAllChange"
								>全选</a-checkbox>
							</div>
							<a-checkbox-group
								v-model="checkedList"
								@change="onChange"
							>
								<a-checkbox :value="`shutDown`">首页</a-checkbox>
								<a-checkbox :value="`channelManage`">频道管理</a-checkbox>
								<a-checkbox :value="`operateRecord`">操作记录</a-checkbox>
								<a-checkbox :value="`userManage`">用户管理</a-checkbox>
							</a-checkbox-group>
						</div>
					</a-form-item>
					<a-form-item
						label="操作权限"
						placeholder="请选择操作权限"
					>
						<a-select v-model="permissionModel">
							<a-select-option :value="1">有</a-select-option>
							<a-select-option :value="0">无</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item
						label="操作密码"
						v-if="permissionModel==1"
					>
						<a-input-password
							placeholder="请输入操作密码"
							v-decorator="[
                            'operatingPwd',
                            {
                              rules: [
                                { required: true, message: '请输入操作密码!' },
                              ],
                            },
                          ]"
						/>
					</a-form-item>
					<a-form-item label="用户信息">
						<a-input
							placeholder="请输入用户信息"
							v-decorator="[
                            'userInfo',
                          ]"
						/>
					</a-form-item>
					<a-form-item label="电话">
						<a-input
							placeholder="请输入电话号码"
							v-decorator="[
                            'tel', 
                          ]"
						/>
					</a-form-item>

					<a-form-item :wrapper-col="{ span: 12, offset: 4 }">
						<a-button
							type="primary"
							html-type="submit"
						>
							确定
						</a-button>
						<a-button @click="handleAdd">
							取消
						</a-button>
					</a-form-item>
				</a-form>
			</a-modal>
			<!-- 编辑用户/重置密码 -->
			<a-modal
				:visible="editUserVisible"
				@cancel="handleEdit"
				:centered="true"
				:footer="''"
				title="编辑用户"
				:maskClosable="false"
				:getContainer="() => $refs.user_manage"
			>
				<a-form
					:form="editUserForm"
					@submit="editUser"
				>
					<a-form-item label="用户名">
						<div
							v-if="this.userId.userName=='admin'"
							style="text-align:left"
						>{{this.userId.userName}}</div>
						<a-input
							v-else
							v-decorator="[
                                'userName', 
                                {
                                initialValue: this.userId.userName?this.userId.userName:'', 
                                rules: [
                                    { required: true, message: '请输入用户名!' },
                                ],
                                },
                            ]"
						/>
					</a-form-item>
					<a-form-item label="昵称">
						<a-input
							v-model="editUserAlias"
							placeholder="昵称不得少于5个字符"
						/>
					</a-form-item>
					<a-form-item label="密码">
						<a-input-password
							placeholder="请输入密码"
							v-decorator="[
                            'passWord', // 给表单赋值或拉取表单时，该input对应的key
                            {
                              rules: [
                                { required: true, message: '请输入密码!' },
                              ],
                            },
                          ]"
						/>
					</a-form-item>
					<a-form-item label="访问权限">
						<div class="visit">
							<div class="visitHead">
								<a-checkbox
									:indeterminate="editIndeterminate"
									:checked="editCheckAll"
									@change="editCheckAllChange"
								>全选</a-checkbox>
							</div>
							<a-checkbox-group
								v-model="editCheckedList"
								@change="editChange"
							>
								<a-checkbox :value="`shutDown`">首页</a-checkbox>
								<a-checkbox :value="`channelManage`">频道管理</a-checkbox>
								<a-checkbox :value="`operateRecord`">操作记录</a-checkbox>
								<a-checkbox :value="`userManage`">用户管理</a-checkbox>
							</a-checkbox-group>
						</div>
					</a-form-item>
					<a-form-item
						label="操作权限"
						placeholder="请选择操作权限"
					>
						<a-select v-model="editPermission">
							<a-select-option :value="1">有</a-select-option>
							<a-select-option :value="0">无</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item
						label="操作密码"
						v-if="editPermission==1"
					>
						<a-input-password
							placeholder="请输入操作密码"
							v-decorator="[
                            'operatingPwd', // 给表单赋值或拉取表单时，该input对应的key
                            {
                              initialValue: '',
                              rules: [
                                { required: true, message: '请输入操作密码!' },
                              ],
                            }
                          ]"
						/>
					</a-form-item>
					<a-form-item label="用户信息">
						<a-input
							placeholder="请输入用户信息"
							v-decorator="[
                            'userInfo', // 给表单赋值或拉取表单时，该input对应的key
                          ]"
						/>
					</a-form-item>
					<a-form-item label="电话">
						<a-input
							placeholder="请输入电话号码"
							v-decorator="[
                            'tel', // 给表单赋值或拉取表单时，该input对应的key
                            {
                              initialValue: this.userId.phone?this.userId.phone:'', 
                            }
                          ]"
						/>
					</a-form-item>
					<a-form-item :wrapper-col="{ span: 12, offset: 4 }">
						<a-button
							type="primary"
							html-type="submit"
						>
							确定
						</a-button>
						<a-button @click="handleEdit">
							取消
						</a-button>
					</a-form-item>
				</a-form>
			</a-modal>

		</div>
	</div>

</template>
<script>
import user from '../api/user';
import { Encryption } from '../utils/encryption';
const encryption = new Encryption();
export default {
	data() {
		return {
			loginUserName: '',
			queryUser: '',
			editUserDialogShow: false,
			id: 0,
			userName: '',
			addUserAlias: '',
			editUserAlias: '',
			passWord: '',
			operatingPwd: '',
			titleType: 0,
			permissionModel: 0,
			editPermission: 0,
			userList: [],
			placeholderText: '',
			addUserVisible: false,
			editUserVisible: false,
			userId: {},
			indeterminate: false,
			checkAll: false,
			checkedList: [],
			editIndeterminate: false,
			editCheckAll: false,
			editCheckedList: [],
		};
	},
	methods: {
		selectUser() {
			let newUser = [];
			if (this.queryUser !== '') {
				for (let i of this.userList) {
					if (i.userName.indexOf(this.queryUser) > -1) {
						newUser.push(i);
					}
				}
			} else {
				this.getUserList();
			}
			this.userList = newUser;
		},
		getUserList() {
			this.loginUserName = JSON.parse(
				sessionStorage.getItem('userInfo')
			).userName;
			user.getUserList().then((res) => {
				if (res.code === 0) {
					this.userList = res.data;
				}
			});
		},
		//新增用户
		addUserShow() {
			this.$nextTick(() => {
				this.addUserAlias = '';
				this.permissionModel = 0;
				this.checkAll = false;
				this.checkedList = [];
				this.addUserForm.resetFields();
				this.addUserVisible = !this.addUserVisible;
			});
		},
		handleAdd() {
			this.addUserVisible = false;
		},
		addUser() {
			let newUserInfo = '';
			let newTel = '';
			this.addUserForm.validateFields((err, values) => {
				this.userName = values.userName;
				this.passWord = values.passWord;
				this.operatingPwd = values.operatingPwd;
				newUserInfo = values.userInfo;
				newTel = values.tel;
			});
			if (this.userName && this.passWord) {
				let params = {
					userName: this.userName,
					userAlias: this.addUserAlias,
					password: this.passWord,
					operatingAuth: this.permissionModel || 0,
					operatingPwd: this.operatingPwd || '',
					menus: this.checkedList.join(','),
					userInfo: newUserInfo,
					phone: newTel,
				};
				console.log(encryption.decrypt(params.userName));
				if (encryption.decrypt(params.userName) !== 'admin') {
					user.saveOrUpdateUser(params).then((res) => {
						if (res.code == 0) {
							this.$message.success('用户添加成功');
							this.getUserList();
							this.addUserVisible = false;
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					this.$message.error('管理员不可添加');
				}
			} else {
				this.$message.error('请输入用户名或密码');
			}
		},
		//编辑用户
		editUserShow(item) {
			this.userId = item;
			this.$nextTick(() => {
				this.editPermission = this.userId.operatingAuth;
				this.editUserAlias = this.userId.userAlias;
				this.editCheckedList = this.userId.menus.split(',');
				if (this.editCheckedList.length === 4) {
					this.editCheckAll = true;
				} else {
					this.editCheckAll = false;
				}
			});
			this.editUserVisible = !this.editUserVisible;
		},

		editUser() {
			let newUserInfo = '';
			let newTel = '';
			this.editUserForm.validateFields((err, values) => {
				this.userName = values.userName;
				this.passWord = values.passWord;
				this.operatingPwd = values.operatingPwd;
				newUserInfo = values.userInfo;
				newTel = values.tel;
			});
			if (this.userId.userName === 'admin') {
				this.userName = 'admin';
			}
			if (this.userName && this.passWord) {
				let params = {
					id: this.userId.id,
					userName: this.userName,
					userAlias: this.editUserAlias,
					password: this.passWord,
					operatingAuth: this.editPermission,
					operatingPwd: this.operatingPwd || '',
					menus: this.editCheckedList.join(','),
					userInfo: newUserInfo,
					phone: newTel,
				};
				user.saveOrUpdateUser(params).then((res) => {
					if (res.code === 0) {
						this.$message.success('用户信息编辑成功');
						this.operatingPwd = null;
						this.editCheckAll = false;
						this.getUserList();
					} else {
						this.$message.error(res.msg);
					}
				});
			} else {
				this.$message.error('请输入用户名或密码');
			}
		},
		handleEdit() {
			this.editUserVisible = !this.editUserVisible;
		},
		deleteUser(target) {
			console.log(target);
			if (target.userName !== 'admin') {
				let params = { ids: String(target.id) };
				this.$confirm({
					title: `确定要删除用户${target.userName}吗`,
					okText: '确定',
					centered: 'true',
					cancelText: '取消',
					onOk: () => {
						user.deleteUsers(params).then((res) => {
							if (res.code === 0) {
								this.$message.success('用户删除成功');
								this.getUserList();
							} else {
								this.$message.error(res.msg);
							}
						});
					},
					onCancel() {},
				});
			}
		},
		onCheckAllChange(e) {
			console.log(e);
			Object.assign(this, {
				checkedList: e.target.checked
					? ['shutDown', 'channelManage', 'operateRecord', 'userManage']
					: [],
				indeterminate: false,
				checkAll: e.target.checked,
			});
		},
		onChange(checkedList) {
			console.log(checkedList);
			this.indeterminate = !!checkedList.length && checkedList.length < 4;
			this.checkAll = checkedList.length === 4;
		},
		editCheckAllChange(e) {
			Object.assign(this, {
				editCheckedList: e.target.checked
					? ['shutDown', 'channelManage', 'operateRecord', 'userManage']
					: [],
				editIndeterminate: false,
				editCheckAll: e.target.checked,
			});
		},
		editChange(editCheckedList) {
			this.editIndeterminate =
				!!editCheckedList.length && editCheckedList.length < 4;
			this.editCheckAll = editCheckedList.length === 4;
		},
		telFormat(mobile) {
			const reg = /(\d{3})\d{4}(\d{4})/;
			if (!reg.test(mobile)) {
				return '';
			}
			let newTel = String(mobile).replace(reg, '$1****$2');
			return newTel;
		},
	},
	created() {
		(this.addUserForm = this.$form.createForm(this)), //注册表单
			(this.editUserForm = this.$form.createForm(this));
	},
	mounted() {
		this.getUserList();
	},
	watch: {
		editUserVisible(val) {
			if (val) {
				this.$nextTick(() => {
					this.editUserForm.setFieldsValue({
						userInfo: this.userId.userInfo,
						passWord: '',
					});
				});
			}
		},
	},
};
</script>

<style lang="scss" scope>
.user{
  width: 100%;
  height: 92%;
  color: #fff;
  .searchs{
    width: 100%;
    height: 6%;
    @include flex-type('',center);
    border: 2px solid #04408a;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 0.5%; 
    label{
      margin-left: .5%;
      font-size: 1.1rem;
    }
    .ant-input-affix-wrapper {
      width: 19rem!important;
      margin-left: .5%;
      .ant-input{
        width: 19rem;
      }
      .ant-input-suffix{
        right: 0.6rem;
      }
    }
    .ant-btn{
      width: 5.667rem;
      height: 2.4rem;
      margin-left: 4rem;
    }
    .addUser{
      margin-left:auto;
      margin-right: 5rem;
      width: 7rem;
    }
    img{
      width:1.6rem;
      height:1.6rem;
      cursor: pointer;
    }
  }
  .user_manage{
    height: 93.5%;
    .table_area{
      height: 100%;
      .tab_Title{
        margin-top: 0;
      }
    }
    .ant-modal{
      width: 44.6rem!important;
      .ant-form-item{
        width: 90%;
        margin-bottom: 1rem;
        .ant-form-item-label{
          width: 6rem;
        }
        .ant-form-item-control-wrapper{
          width: calc(100% - 6rem);
          .ant-form-item-control{
            width: 100%;
            justify-content: flex-start;
            .ant-form-item-children{
              width: 100%;
              text-align: left;
              .ant-input{
                width: 100%;
              }
              .ant-input-password{
                width: 100%!important;
              }
              .ant-select{
                width: 100%;
              }
            }
          }
        }
      }
    }
    .visit{
      width:100%;
      height:7rem;
      border:1px solid #04408a;
      .visitHead{
        @include flex-type('',center);
        height:3.2rem;
        border-bottom:1px solid #04408a;
        text-align:left;
      }
    }
    .btn_disabled{
      color:#c8c9cc!important;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1)!important;
      cursor:not-allowed !important;
    }  
  }
}
    
</style>