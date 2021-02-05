<template>
	<div class="nav">
		<div class="shutDownHeader">
			<p>直播安全一键关停系统</p>
			<div
				class="userInfo"
				ref="userInfo"
			>
				<div>
					<span class="iconfont">&#xe65b;</span>
					<p>{{this.alias}}</p>
					<div @click="showDialog">
						<span class="iconfont">&#xe627;</span>
						<p>修改密码</p>
					</div>
				</div>
				<div @click="loginOut">
					<span class="iconfont">&#xe618;</span>
					<p>退出</p>
				</div>
				<a-modal
					:visible="visible"
					@cancel="canleDialog"
					:centered="true"
					:maskClosable="false"
					title="修改密码"
					@ok="updatePwd"
				>
					<div style="margin:0 auto 20px auto;width:350px;">
						<label style="display:inline-block;width: 4rem;height: 2rem;font-size: 1.1rem;color:#fff;">用户名:</label>
						<p style="display:inline-block;width:10rem;height:2rem;margin-bottom:0;font-size: 1.1rem;color:#fff;padding-left:5px">{{userName}}</p>
					</div>
					<div style="margin:0 auto 20px auto;width:350px">
						<label style="display:inline-block;width: 4rem;height: 2rem;font-size: 1.1rem;color:#fff;">原密码:</label>
						<a-input-password v-model="oddPassword"></a-input-password>
					</div>
					<div style="margin:0 auto;width:350px">
						<label style="display:inline-block;width: 4rem;height: 2rem;font-size: 1.1rem;color:#fff;">新密码:</label>
						<a-input-password v-model="newPassword"></a-input-password>
					</div>
				</a-modal>
			</div>
		</div>
		<div class="navBody">
			<div class="navWrap">
				<div class="borderLine"></div>
				<div
					v-if="routerShow.shutDown"
					class="shouye"
					:class="[currentIndex?'iconActivity': '']"
					@click="getRouter(1)"
				>
					<span
						class="iconfont icon-shouye"
						@click="getRouter(1)"
					></span>
					<router-link
						to="/shutDown"
						@click="getRouter(1)"
					>首页</router-link>
				</div>
				<div class="borderLine"></div>
				<div
					v-if="routerShow.channelManage"
					class="channel"
					:class="[currentChannel?'iconActivity': '']"
					@click="getRouter(2)"
				>
					<span
						class="iconfont icon-pindao"
						@click="getRouter(2)"
					></span>
					<router-link
						to="/channelManage"
						@click="getRouter(2)"
					>频道管理</router-link>
				</div>
				<div class="borderLine"></div>
				<div
					v-if="routerShow.operateRecord"
					class="jilu"
					:class="[currentRecord?'iconActivity': '']"
					@click="getRouter(3)"
				>
					<span
						class="iconfont icon-jilu"
						@click="getRouter(3)"
					></span>
					<router-link
						to="/operateRecord"
						@click="getRouter(3)"
					>操作记录</router-link>
				</div>
				<div class="borderLine"></div>
				<div
					v-if="routerShow.userManage"
					class="user"
					:class="[currentUser?'iconActivity': '']"
					@click="getRouter(4)"
				>
					<span
						class="iconfont icon-yonghu"
						@click="getRouter(4)"
					></span>
					<router-link
						to="/userManage"
						@click="getRouter(4)"
					>用户管理</router-link>
				</div>
				<div class="borderLine"></div>
			</div>
		</div>

	</div>
</template>
<script>
import user from '../api/user';
export default {
	data() {
		return {
			currentIndex: false,
			currentChannel: false,
			currentRecord: false,
			currentUser: false,
			visible: false,
			userName: null,
			oddPassword: null,
			newPassword: null,
			alias: '',
			routerShow: {
				shutDown: false,
				channelManage: false,
				operateRecord: false,
				userManage: false,
			},
		};
	},
	methods: {
		getRouter(index) {
			switch (index) {
				case 1:
					this.$router.push('/shutDown');
					this.currentIndex = true;
					this.currentChannel = false;
					this.currentRecord = false;
					this.currentUser = false;
					break;
				case 2:
					this.$router.push('/channelManage');
					this.currentIndex = false;
					this.currentChannel = true;
					this.currentRecord = false;
					this.currentUser = false;
					break;
				case 3:
					this.$router.push('/operateRecord');
					this.currentIndex = false;
					this.currentChannel = false;
					this.currentRecord = true;
					this.currentUser = false;
					break;
				case 4:
					this.$router.push('/userManage');
					this.currentIndex = false;
					this.currentChannel = false;
					this.currentRecord = false;
					this.currentUser = true;
					break;
			}
		},
		loginOut() {
			sessionStorage.removeItem('userInfo');
			this.$router.push('/login');
		},
		showDialog() {
			this.userName = JSON.parse(sessionStorage.getItem('userInfo')).userName;
			this.visible = true;
		},
		updatePwd() {
			if (
				!this.oddPassword ||
				!this.oddPassword ||
				!this.newPassword ||
				!this.newPassword
			) {
				this.$message.warning('密码不能为空');
			} else {
				if (this.oddPassword == this.newPassword) {
					this.$message.warning('新密码不能与原始密码相同');
				} else {
					let oddPwd = JSON.parse(sessionStorage.getItem('userInfo')).passWord;
					if (this.oddPassword !== oddPwd) {
						this.$message.error('请输入正确的原始密码');
					} else {
						let params = {
							id: JSON.parse(sessionStorage.getItem('userInfo')).id,
							password: this.newPassword,
						};
						user.updateUserpassword(params).then((res) => {
							if (res.code === 0) {
								this.$message.success('密码修改成功');
							} else {
								this.$message.error(res.msg);
							}
						});
						let {
							id,
							userName,
							passWord,
							operatingAuth,
							operatingPwd,
							menus,
							userAlias,
						} = JSON.parse(sessionStorage.getItem('userInfo'));
						passWord = this.newPassword;
						let userInfo = {
							id,
							userName,
							passWord,
							operatingAuth,
							operatingPwd,
							menus,
							userAlias,
						};
						sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
						this.oddPassword = null;
						this.newPassword = null;
						this.visible = false;
					}
				}
			}
		},
		canleDialog() {
			this.visible = false;
			this.oddPassword = null;
			this.newPassword = null;
		},

		getPermission() {
			//获取用户信息
			this.alias = JSON.parse(sessionStorage.getItem('userInfo')).userAlias;
			let { menus } = JSON.parse(sessionStorage.getItem('userInfo'));
			if (menus.indexOf('shutDown') > -1) {
				this.routerShow.shutDown = true;
			}
			if (menus.indexOf('channelManage') > -1) {
				this.routerShow.channelManage = true;
			}
			if (menus.indexOf('operateRecord') > -1) {
				this.routerShow.operateRecord = true;
			}
			if (menus.indexOf('userManage') > -1) {
				this.routerShow.userManage = true;
			}
			if (menus.indexOf('all') > -1) {
				this.routerShow.shutDown = true;
				this.routerShow.channelManage = true;
				this.routerShow.operateRecord = true;
				this.routerShow.userManage = true;
			}
		},
	},
	mounted() {
		this.getRouter();
		this.getPermission();
	},
};
</script>
<style lang="scss" scope>
  .nav{
    width: 100%;
    height:5.1rem;
    position: relative;
    .shutDownHeader{
      width: 100%;
      height: 100%;
      position: relative;
      p{
        width: 80.28%;
        height: 100%;
        font-size: 2.26rem;
        margin: 0 auto;
        font-weight: 500;
        text-shadow: 0px 2px 0px #000606;
        @include flex-type(center,'');
      }
      .userInfo{
        position: absolute;
        right: 0;
        top:calc(50%);
        width: 200px;
        height: 24px;
        @include flex-type(center,center);
        div:nth-child(1){
          @include flex-type(center,center);
          margin-right: 20px;
          height:1.466rem;
          position: relative;
          cursor: pointer;
          span{
            @include flex-type(center,center);
            margin-right: 5px;
            font-size: 1.2rem;
            height: 1.2rem;
          }
          p{
            font-size: 1rem;
          }

          div{
            display: none;
            position: absolute;
            left: .5rem;
            bottom: -2rem;
            z-index: 10;
            height:2rem;
            line-height: 40px;
            background: #0c408c;
				    border: 1px solid #2287fb;
            cursor: pointer;
            .iconfont{
              @include flex-type(center,center);
              margin-right: 5px;
              font-size: 1.6rem;
              height: 1.6rem;
            }
            p{
              font-size: 1rem;
              text-align: left;
              width: 65px;
              @include flex-type(center,center);
              height: 1.6rem;

            }
          }
          &:hover{
            div{
              @include flex-type(center,center);
            }
          }
        }
        div:nth-child(2){
          @include flex-type(center,center);
          height:1.466rem;
          cursor: pointer;
          span{
            @include flex-type(center,center);
            margin-right: 5px;
            font-size: 1.05rem;
            height: 1.05rem;
          }
          p{
            font-size: 1rem;
            width: 40px;
          }
        }
      }
      @media (max-width:1366px) {
        .userInfo{
          top: 1.7rem;
        }
      }
    }
    .navBody{
      width: 2px;
      transition: width .5s;
      height: 94rem;
      position: absolute;
      left: 0rem;
      top: -3.5rem;
      z-index: 2;
      position: relative;
      .anticon{
        position: absolute;
        right: -2.4rem;
        top: 28rem;
        height: 8rem;
        border-radius: 0 70px 70px 0;
        background: rgba(4,64,138,0.94);
        padding-top: 2.8rem;
        svg{
          width: 2.4rem;
          height: 2.4rem;
          color: #ffa800;
        }
      }
    }
    .navWrap{
      width:2px;
      transition: width .5s;
      height: 94rem;
      overflow: hidden;
      background: rgba(4,64,138,0.94);
      border-right: 2px solid #0a4a90;
      border-bottom: 2px solid #0a4a90;
      
      .borderLine{
        width: 100%;
        height: 1px;
        background: -webkit-gradient(linear,left top,right top,from(transparent),color-stop(50%),to(hsla(0,0%,100%,.41)));
        background: linear-gradient(90deg,transparent,50%,hsla(0,0%,100%,.41));
      }
      .shouye,.channel,.jilu,.user{
        height: 5.4rem;
        width: 100%;
        padding: 0.5rem 0;
        cursor: pointer;
        .iconfont{
          display: block;
          width: 10rem;
          height: 2.4rem;
          font-size: 1.5rem;
          cursor: pointer;
        }
        a {
          display: block;
          width: 10rem;
          height: 2.4rem;
          font-size: 1.3rem;
          font-weight: 400;
          color: #fff;
          float: left;
          &.router-link-active{
            color: #ffa800;
          }
        }
        
      }
      .shouye:hover,.channel:hover,.jilu:hover,.user:hover{
        background: url("../assets/images/navBg.png") center no-repeat;
        background-size:100% 100%;
        .iconfont{
          color: #f0bd26;
        }
        a{
          color: #f0bd26;
        }
      }
      .iconActivity{
        background: url("../assets/images/navBg.png") center no-repeat;
        background-size:100% 100%;
        .iconfont{
          color:#ffa800;
        }
      }
    }
    .navBody:hover{
      width: 10rem;
      transition: width .5s;
      .navWrap{
        width: 10rem;
        transition: width .5s;
      }
    }
  }
</style>