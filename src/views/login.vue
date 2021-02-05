<template>
	<div class="login">
		<div class="login_content">
			<div class="project_info">
				<div class="project_name">
					<span class="name_highlight">直播安全</span>
					<span class="sys_name">一键关停系统</span>
				</div>
				<div class="feature_display">
				</div>
			</div>
			<div class="login_in">
				<div class="login_box">
					<div class="login_head">
						<img src="../assets/images/login_head.png" /><span class="head_title">用户登录</span>
					</div>
					<div class="input_bg">
						<a-input
							v-model="data.userName"
							placeholder="请输入账号"
						></a-input>
					</div>
					<div class="input_bg">
						<a-input
							v-model="data.passWord"
							type="password"
							placeholder="请输入密码"
							@pressEnter="login(data)"
						></a-input>
					</div>
					<div class="enter"><span @click="login(data)">登录</span></div>
				</div>
			</div>
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
			data: {
				userName: '',
				passWord: '',
			},
		};
	},
	mounted() {},
	methods: {
		login(userData) {
			let vm = this;
			//传给后台的参数
			let params = {
				// userName: encryption.encrypt(userData.userName),
				// password: encryption.encrypt(userData.passWord),
				userName: userData.userName,
				password: userData.passWord,
			};
			if (vm.data.userName && vm.data.passWord) {
				user.login(params).then((res) => {
					if (res.code === 0) {
						let {
							id,
							menus,
							operatingAuth,
							operatingPwd,
							userAlias,
							userName,
						} = res.data;
						let userInfo = {
							id,
							menus,
							operatingAuth,
							operatingPwd,
							userAlias,
							userName,
							password: encryption.encrypt(userData.passWord),
						};
						sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
						vm.$message.success('登录成功');
						vm.$router.push({ name: 'ShutDown' });
					} else {
						vm.$message.error(res.msg);
					}
				});
			} else {
				vm.$message.warn('用户名或密码不能为空');
			}
		},
	},
};
</script>
<style lang="scss" scope>
.login {
	height: 100%;
	width: 100%;
	position: relative;
	background-image: url('../assets/images/login_bg.png');
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;

	.login_content {
		width: 85%;
		height: 50%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.project_info {
		padding: 5rem 5rem 6rem 0;
		width: 897px;
		height: 484px; 
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.login_in {
		width: 45%;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.login_box {
		width: 580px;
		height: 436px;
		padding: 67px;
		background: url('../assets/images/box.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.name_highlight {
		color: #ec9d18;
		font-size: 3.5rem;
		letter-spacing: 1rem;
	}

	.sys_name {
		letter-spacing: 1rem;
		font-size: 1.8rem;
		color: #ffffff;
	}

	.project_name {
		width: 100%;
		text-align: center;
	}

	.feature_display {
		width: 80%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.feature_info {
		flex: 1;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
	}

	.feature_icon {
		width: 5rem;
		height: 5rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.feature_name {
		margin-top: 0.5rem;
		font-size: 1rem;
		color: #ffffff;
	}

	.login_head {
		position: relative;
		margin-bottom: 1rem;
	}

	.head_title {
		color: rgba(0, 132, 255, 1);
		font-size: 1.3rem;
		position: absolute;
		left: calc(50% - 2.5rem);
		top: 0;
	}

	.ant-input {
    font-size: 1rem;
    color: #fff;
		width: 407px;
		height: 55px;
		border-radius: 0.5rem;
		border: none;
		background: url('../assets/images/input.png') no-repeat;
    background-size: 100% 100%;
    text-align: left;
    padding-left: 20px;
	}
	.ant-input:focus {
		border: none;
		box-shadow: none;
	}
	.input_bg {
		margin-top: 1.5rem;
		width: 90%;
		height: 18%;
	}

	.enter > span {
    cursor: pointer;
    @include flex-type(center,center);
    font-size: 1.6rem;
		width: 407px;
		height: 55px;
		margin-top: 37px;
		color: #ffffff;
		background: url('../assets/images/button.png') no-repeat;
		background-size: 100% 100%;
	}
	@media (max-height: 700px) {
		.enter {
			margin-top: 1.5rem;
		}
	}
}
</style>
