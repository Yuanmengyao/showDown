<template>
	<div
		class="shutDown"
		ref="shutDown"
	>
		<div class="shutDownBody">
			<div class="leftBody">
				<div class="title">
					<p>频道列表</p>
				</div>
				<div class="search">
					<a-input
						v-model="channelName"
						@keyup.enter="searchChannel(0)"
					>
						<img
							src="../assets/images/搜索-icon@2x.png"
							alt=""
							slot="suffix"
							@click="searchChannel(0)"
						>
					</a-input>
					<div
						class="defaultBatch"
						style="cursor:not-allowed;font-size:1.2rem"
						v-if="!batchSelectSwitch && showBtn"
					>批量选择</div>
					<div
						v-if="batchSelectSwitch && showBtn"
						style="font-size:1.2rem"
						:class="[batchSelectStatus?'selectBatch':'defaultBatch']"
						@click="batchSelectAll "
					>批量选择</div>
					<div
						v-if="showBtn"
						@click="allClosed(1,1)"
						style="font-size:1.2rem"
					>一键关停</div>
					<div
						v-if="showBtn"
						@click="allClosed(2,1)"
						style="cursor:pointer;font-size:1.2rem"
					>一键恢复</div>
				</div>
				<div class="importantList">
					<div class="leftDivHeader">
						<p style="margin-right:2rem">重要频道</p>
						<label for="">重要频道总数:</label>
						<p style="margin-left:0">{{importantNum}}</p>
						<div
							@click="allSelect"
							style="font-size:1.2rem"
							:class="[allSelectStatus?'selectAll':'defaultAll']"
						>全选</div>
					</div>
					<div class="leftDivBody">
						<div
							v-for="item in importantList"
							:key="item.id"
						>
							<div
								@click="selectImportant(item)"
								:class="[item.clickStatus? 'selectChannel':'defaultChannel']"
								:title="item.alias"
							>
								{{item.alias}}
							</div>
						</div>
					</div>
				</div>
				<div class="importantList otherList">
					<div class="leftDivHeader">
						<p style="margin-right:2rem">其他频道</p>
						<label for="">其他频道总数:</label>
						<p style="margin-left:0">{{otherNum}}</p>
					</div>
					<div class="leftDivBody">
						<div
							class="bottom_channel"
							v-for="item in otherList"
							:key="item.id"
						>
							<a-tooltip
								:title="item.alias"
								:destroyTooltipOnHide="true"
							>
								<div
									@click="selectOther(item)"
									:class="[item.clickStatus? 'selectChannel':'defaultChannel']"
									:title="item.alias"
								>
									{{item.alias}}
								</div>
							</a-tooltip>
						</div>
					</div>
				</div>
			</div>
			<div class="rightBody">
				<div class="title">
					<p>已关停频道</p>
				</div>
				<div class="search">
					<a-input
						placeholder="请输入频道名称"
						v-model="closedInput"
						@keyup.enter="searchChannel(1)"
					>
						<img
							src="../assets/images/搜索-icon@2x.png"
							alt=""
							slot="suffix"
							@click="searchChannel(1)"
						>
					</a-input>
					<div
						v-if="batchSelectClosedSwitch && showBtn"
						style="font-size:1.2rem"
						:class="[batchSelectClosedStatus?'selectBatchClosed':'defaultBatchClosed']"
						@click="batchSelectClosed"
					>批量选择</div>
					<div
						class="defaultBatchClosed"
						style="cursor:not-allowed;font-size:1.2rem"
						v-if="!batchSelectClosedSwitch && showBtn"
					>批量选择</div>

					<div
						v-if="showBtn"
						@click="allClosed(2,2)"
						style="cursor:pointer;font-size:1.2rem"
					>一键恢复</div>
				</div>
				<div class="importantList">
					<div class="leftDivHeader">
						<p style="margin-right:2rem">已关停频道</p>
						<label for="">已关停频道总数:</label>
						<p style="margin-left:0">{{closedNum}}</p>
						<div
							@click="closedAllSelect"
							style="font-size:1.2rem"
							:class="[closedAllSelectStatus?'selectAll':'defaultAll']"
						>全选</div>
					</div>
					<div class="leftDivBody">
						<div
							v-for="item in closedList"
							:key="item.id"
						>
							<div
								:class="[item.clickStatus? 'selectChannel':'defaultChannel']"
								@click="closedChannel(item)"
								:title="item.alias"
							>
								{{item.alias}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="shutDownFoot"
			ref="shutDownFoot"
		>
			<div class="footHeader">
				<p>操作记录</p>
			</div>
			<div class="footTable">
				<a-table
					:columns="columnsLog"
					:data-source="dataTable"
					:rowClassName="rowClassName"
					:scroll="scroll"
					:pagination="false"
					:rowKey="(record)=>record.id"
				>
					<template
						slot="platform"
						slot-scope="record"
					>
						<div>{{record==1?'华为平台':(record==2?'中兴平台':'其他')}}</div>
					</template>
					<template
						slot="channelName"
						slot-scope="text"
					>
						<div>{{text?text:'——'}}</div>
					</template>
					<template
						slot="describe"
						slot-scope="text"
					>
						<div>{{text?text:'--'}}</div>
					</template>
					<template
						slot="reviewer"
						slot-scope="text, record"
					>
						<div
							style="color:rgba(3,245,255,1);cursor:pointer;"
							v-if="text!==''"
							@click="showDialog(record)"
						>{{text}}
						</div>
						<div
							style="color:rgba(255, 151, 3, 1);cursor: pointer;"
							@click="showDialog(record)"
							v-else
						>{{text?text:'待复核'}}</div>
					</template>

				</a-table>
				<a-modal
					:visible="visible"
					@cancel="canleChannelDia"
					:centered="true"
					:maskClosable="false"
					title="操作确认"
					:getContainer="() => $refs.shutDown"
					@ok="closedOrRecover"
				>
					<template slot="closeIcon">
						<a-icon type="close-circle" />
					</template>
					<div class="action"><span>执行动作</span>
						<p>{{this.title}}</p>
					</div>
					<div class="executeObj"><span>执行对象</span>
						<p
							:class="[HWStatus?'selectP':'defaultP']"
							@click="selectModalAll(0)"
						>华为平台</p>
						<div class="channel">
							<div
								v-for="item in confirmClosedList"
								:key="item.id"
							>
								<div
									:class="[item.clickStatus?'selectChannel':'defaultChannel']"
									@click="HWChannel(item)"
									:title="item.alias"
									v-if="item.platform===1"
								>{{item.alias}}</div>
							</div>
						</div>
					</div>
					<div class="executeObjZX">
						<p
							:class="[ZXStatus?'selectP':'defaultP']"
							@click="selectModalAll(1)"
						>中兴平台</p>
						<div class="channel">
							<div
								v-for="item in confirmClosedList"
								:key="item.id"
							>
								<div
									@click="ZTEChannel(item)"
									:class="[item.clickStatus?'selectChannel':'defaultChannel']"
									:title="item.alias"
									v-if="item.platform===2"
								>{{item.alias}}</div>
							</div>

						</div>
					</div>
					<div class="time"><span>执行时间</span>
						<p>{{dataTime}}</p>
					</div>
					<div class="operator">
						<span>操作员</span>
						<p>{{operatorName}}</p>
						<div>

						</div>
						<label for="">操作密码:</label>
						<a-input-password
							v-model="password"
							type="passWord"
							placeholder="请输入操作密码"
						></a-input-password>
					</div>
				</a-modal>
				<a-modal
					:visible="reviewerVisible"
					@cancel="canleDialog"
					:centered="true"
					:maskClosable="false"
					title="复核确认"
					:getContainer="() => $refs.shutDownFoot"
					@ok="reviewerIdea"
				>
					<template slot="closeIcon">
						<a-icon type="close-circle" />
					</template>
					<div class="time"><span>执行时间</span>
						<p>{{dataTime}}</p>
					</div>
					<div class="operator">
						<span>复核员</span>
						<div class="borderClass">{{this.reviewName}}</div>
					</div>
					<div class="operator">
						<span>密码</span>
						<a-input-password
							v-model="reviewerPwd"
							type="passWord"
							placeholder="请输入密码"
						></a-input-password>
					</div>
					<div
						class="operator"
						style="height:7rem"
					>
						<span>复核意见</span>
						<a-textarea
							v-if="currentReviewer"
							v-model="reviewerOpinion"
							placeholder="请输入复核意见"
							:auto-size="{ minRows: 3, maxRows: 5 }"
						></a-textarea>
						<div
							v-else
							style="color:#fff;"
						>{{this.reviewerOpinion}}</div>
					</div>
				</a-modal>
			</div>
		</div>
	</div>
</template>
<script>
import channel from '../utils/channel.js';
import channelManage from '../api/channelManage';
import record from '../api/recordLog';
import moment from 'moment';
import { Encryption } from '../utils/encryption';
const encryption = new Encryption();
export default {
	data() {
		return {
			columnsLog: channel.columnsLog,
			currentLog: null,
			dataTable: [],
			channelList: [],
			importantList: [],
			otherList: [],
			closedList: [],
			channelName: '',
			closedChannelName: '',
			allSelectStatus: false, //重要频道全选按钮状态
			batchSelectStatus: false, //左侧批量选择状态
			batchSelectSwitch: false,
			closedInput: '', //右侧输入框值
			closedAllSelectStatus: false,
			batchSelectClosedSwitch: false,
			batchSelectClosedStatus: false,
			visible: false,
			title: null,
			reviewerVisible: false,
			confirmClosedList: [],
			HWStatus: false,
			ZXStatus: false,
			dataTime: null,
			password: null,
			timer: null,
			logTimer: null,
			scroll: { y: 114 },
			windowSize: document.body.clientWidth,
			sign: null, //关停 or 恢复按钮标识
			reviewName: null,
			reviewerPwd: null,
			reviewerOpinion: null,
			loginUserId: 2,
			currentReviewer: true,
			showBtn: true,
			operatorName: null,
			importantNum: 0,
			otherNum: 0,
			closedNum: 0,
		};
	},
	methods: {
		getChannelList(index) {
			channelManage.getChannelList().then((res) => {
				if (res.code === 0) {
					if (res.data.length > 0) {
						res.data.forEach((item) => {
							item.clickStatus = false;
						});
						this.channelList = res.data;
						//首页初始化
						if (index === 1) {
							this.initChannelList();
						}
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		initChannelList() {
			this.importantList = this.channelList.filter(
				(item) => item.groupId === 1 && item.status === 1
			);
			this.importantNum = this.importantList.length;
			this.otherList = this.channelList.filter(
				(item) => item.groupId === 2 && item.status === 1
			);
			this.otherNum = this.otherList.length;
			this.closedList = this.channelList.filter((item) => item.status === 0);
			this.closedNum = this.closedList.length;
		},
		selectImportant(item) {
			item.clickStatus = !item.clickStatus;

			if (this.channelName.length === 0) {
				this.allSelectStatus = this.importantList.every(
					(item) => item.clickStatus === true
				);
			}

			if (this.channelName.length > 0) {
				this.batchSelectStatus =
					this.importantList.every((item) => item.clickStatus === true) &&
					this.otherList.every((item) => item.clickStatus === true);
			}
		},
		selectOther(item) {
			item.clickStatus = !item.clickStatus;
			if (this.channelName.length > 0) {
				this.batchSelectStatus =
					this.importantList.every((item) => item.clickStatus === true) &&
					this.otherList.every((item) => item.clickStatus === true);
			}
		},
		searchChannel(index) {
			if (index === 0) {
				if (this.channelName.length > 0) {
					let newArr = [];
					let newArrOther = [];
					for (let item of this.channelList) {
						if (
							item.name.indexOf(this.channelName.toUpperCase()) !== -1 &&
							item.groupId === 1 &&
							item.status === 1
						) {
							item.clickStatus = false;
							newArr.push(item);
						}
						if (
							item.name.indexOf(this.channelName.toUpperCase()) !== -1 &&
							item.groupId === 2 &&
							item.status === 1
						) {
							item.clickStatus = false;
							newArrOther.push(item);
						}
					}
					this.batchSelectSwitch = true;
					this.allSelectStatus = false;
					this.importantList = newArr;
					this.importantNum = this.importantList.length;
					this.otherList = newArrOther;
					this.otherNum = this.otherList.length;
					this.batchSelectStatus = false;
					this.importantList.length === 0 &&
						this.otherList.length === 0 &&
						this.$message.info('未找到符合查询条件的频道');
				} else {
					this.getChannelList(1);
					this.batchSelectSwitch = false;
					this.batchSelectStatus = false;
					this.allSelectStatus = false;
				}
			} else if (index === 1) {
				if (this.closedInput.length > 0) {
					this.batchSelectClosedSwitch = true;
					let newArr = [];
					for (let item of this.channelList) {
						if (
							item.name.indexOf(this.closedInput.toUpperCase()) !== -1 &&
							item.status === 0
						) {
							item.clickStatus = false;
							newArr.push(item);
						}
					}
					this.closedList = newArr;
					this.closedNum = this.closedList.length;
					this.closedList.length === 0 &&
						this.$message.info('未找到符合查询条件的频道');
				} else {
					this.getChannelList();
					this.batchSelectClosedSwitch = false;
				}
			}
		},
		//批量选择
		batchSelectAll() {
			this.batchSelectStatus = !this.batchSelectStatus;
			if (this.batchSelectStatus) {
				for (let item of this.importantList) {
					item.clickStatus = true;
				}
				for (let item of this.otherList) {
					item.clickStatus = true;
				}
			} else {
				for (let item of this.importantList) {
					item.clickStatus = false;
				}
				for (let item of this.otherList) {
					item.clickStatus = false;
				}
			}
		},
		//右侧批量选择
		batchSelectClosed() {
			this.batchSelectClosedStatus = !this.batchSelectClosedStatus;
			if (this.batchSelectClosedStatus) {
				this.closedAllSelect();
				this.closedAllSelectStatus = true;
			} else {
				this.closedAllSelect();
				this.closedAllSelectStatus = false;
			}
		},
		allSelect() {
			this.allSelectStatus = !this.allSelectStatus;
			if (this.allSelectStatus) {
				let newArr = [];
				for (let item of this.importantList) {
					item.clickStatus = true;
					newArr.push(item);
				}
				this.importantList = newArr;
			} else {
				let newArr = [];
				for (let item of this.importantList) {
					item.clickStatus = false;
					newArr.push(item);
				}
				this.importantList = newArr;
			}
		},
		closedAllSelect() {
			this.closedAllSelectStatus = !this.closedAllSelectStatus;
			if (this.closedAllSelectStatus) {
				let newArr = [];
				for (let item of this.closedList) {
					item.clickStatus = true;
					newArr.push(item);
				}
				this.closedList = newArr;
			} else {
				let newArr = [];
				for (let item of this.closedList) {
					item.clickStatus = false;
					newArr.push(item);
				}
				this.closedList = newArr;
			}
		},
		closedChannel(item) {
			item.clickStatus = !item.clickStatus;
			this.closedAllSelectStatus = this.closedList.every(
				(item) => item.clickStatus === true
			);
		},
		//一键关停
		allClosed(text, index) {
			this.showChannelDia(text, index);
		},
		showChannelDia(text, index) {
			this.timer && clearInterval(this.timer);
			//解决页面时间延时问题
			this.dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
			this.timer = setInterval(() => {
				this.dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
			}, 1000);
			this.operatorName = JSON.parse(
				sessionStorage.getItem('userInfo')
			).userAlias;
			if (text === 1 && index === 1) {
				this.sign = 1;
				this.title = '一键关停';
				for (let item of this.importantList) {
					if (item.clickStatus) {
						this.confirmClosedList.push(item);
					}
				}
				for (let obj of this.otherList) {
					if (
						obj.clickStatus &&
						this.importantList.filter((item) => item.id === obj.id).length < 1
					) {
						this.confirmClosedList.push(obj);
					}
				}
				if (this.confirmClosedList.length > 0) {
					this.HWStatus = this.confirmClosedList.some(
						(item) => item.platform === 1
					);
					this.ZXStatus = this.confirmClosedList.some(
						(item) => item.platform === 2
					);
				}
			} else if (text === 2 && index === 1) {
				this.sign = 2;
				this.title = '一键恢复';
				for (let item of this.importantList) {
					if (item.clickStatus) {
						this.confirmClosedList.push(item);
					}
				}
				for (let obj of this.otherList) {
					if (
						obj.clickStatus &&
						this.importantList.filter((item) => item.id === obj.id).length < 1
					) {
						this.confirmClosedList.push(obj);
					}
				}
				this.HWStatus = this.confirmClosedList.some(
					(item) => item.platform === 1
				);
				this.ZXStatus = this.confirmClosedList.some(
					(item) => item.platform === 2
				);
			} else {
				this.sign = 3;
				this.title = '一键恢复';
				for (let item of this.closedList) {
					if (item.clickStatus) {
						this.confirmClosedList.push(item);
					}
				}
				this.closedAllSelectStatus = false;
				this.batchSelectClosedStatus = false;
				this.HWStatus = this.confirmClosedList.some(
					(item) => item.platform === 1
				);
				this.ZXStatus = this.confirmClosedList.some(
					(item) => item.platform === 2
				);
			}
			if (this.confirmClosedList.length === 0) {
				this.$message.warn('请先选择频道');
			} else {
				this.visible = !this.visible;
			}
		},
		selectModalAll(index) {
			if (index === 0) {
				this.HWStatus = !this.HWStatus;
				if (this.HWStatus) {
					for (let item of this.confirmClosedList) {
						item.clickStatus = true;
					}
				} else {
					for (let item of this.confirmClosedList) {
						item.clickStatus = false;
					}
				}
			}
		},
		canleChannelDia() {
			this.visible = !this.visible;
			this.timer && clearInterval(this.timer);
			this.sign = null;
			this.confirmClosedList = [];
		},
		showDialog(item) {
			this.logTimer && clearInterval(this.logTimer);
			this.currentLog = item;
			if (this.currentLog.reviewIdea) {
				if (
					this.currentLog.reviewer ===
					JSON.parse(sessionStorage.getItem('userInfo')).userAlias
				) {
					this.currentReviewer = true;
				} else {
					this.currentReviewer = false;
				}
				this.reviewName = this.currentLog.reviewer;
				this.dataTime = this.currentLog.reviewerTime;
				this.reviewerOpinion = this.currentLog.reviewIdea;
				this.reviewerVisible = !this.reviewerVisible;
			} else {
				if (
					this.currentLog.operatorId ===
					JSON.parse(sessionStorage.getItem('userInfo')).id
				) {
					this.$message.warn('不能复核自己的操作记录');
					return;
				}
				this.reviewName = JSON.parse(
					sessionStorage.getItem('userInfo')
				).userAlias;
				//解决页面时间延时问题
				this.dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
				this.logTimer = setInterval(() => {
					this.dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
				}, 1000);
				this.currentReviewer = true;
				this.reviewerPwd = null;
				this.reviewerOpinion = null;
				this.reviewerVisible = !this.reviewerVisible;
			}
		},
		canleDialog() {
			this.reviewerVisible = !this.reviewerVisible;
			this.logTimer && clearInterval(this.logTimer);
		},

		closedOrRecover() {
			let channelIds = null;
			let channelIdList = [];
			this.confirmClosedList.map((item) => {
				if (item.clickStatus) {
					channelIdList.push(item.id);
				}
			});
			channelIds = channelIdList.join(',');
			let { id, userAlias } = JSON.parse(sessionStorage.getItem('userInfo'));
			let params = { channelIds, userAlias, userId: id };
			if (
				this.password ===
				JSON.parse(sessionStorage.getItem('userInfo')).operatingPwd
			) {
				clearInterval(this.timer);
				if (this.sign === 1) {
					channelManage.closed(params).then((res) => {
						if (res.code === 0) {
							this.getChannelList(1);
							this.channelName = null;
							this.batchSelectStatus = false;
							this.allSelectStatus = false;
							this.visible = !this.visible;
							this.getRecordList();
							this.$message.success('频道关停成功');
						} else {
							this.$message.error(res.msg);
						}
					});
				} else if (this.sign === 2) {
					this.channelRecover(params);
				} else {
					this.channelRecover(params);
				}
				this.confirmClosedList = [];
				this.password = null;
			} else {
				this.$message.error('操作密码错误');
			}
		},
		channelRecover(params) {
			channelManage.recover(params).then((res) => {
				if (res.code === 0) {
					this.getChannelList(1);
					this.allSelectStatus = false;
					this.batchSelectStatus = false;
					this.visible = !this.visible;
					this.getRecordList();
					this.$message.success('频道恢复成功');
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		reviewerIdea() {
			let { id } = this.currentLog;
			let params = {
				id: id,
				reviewerId: JSON.parse(sessionStorage.getItem('userInfo')).id,
				reviewer: JSON.parse(sessionStorage.getItem('userInfo')).userAlias,
				reviewIdea: this.reviewerOpinion,
			};
			if (this.currentReviewer) {
				if (
					this.reviewerOpinion &&
					this.reviewerPwd ===
						encryption.decrypt(
							JSON.parse(sessionStorage.getItem('userInfo')).password
						)
				) {
					record.reviewer(params).then((res) => {
						if (res.code === 0) {
							this.getRecordList();
							this.reviewerPwd = null;
							this.reviewerOpinion = null;
							this.reviewerVisible = !this.reviewerVisible;
							clearInterval(this.timer);
							this.$message.success('复核成功');
						} else {
							this.$message.error(res.msg);
						}
					});
				} else {
					this.$message.warn('密码不正确或复核条件为空');
				}
			} else {
				this.$message.warn('当前操作记录你没有复核权限');
			}
		},
		HWChannel(item, index) {
			if (index === 0) {
				item.clickStatus = !item.clickStatus;
				for (let item of this.confirmClosedList) {
					if (item.clickStatus) {
						this.HWStatus = true;
					} else {
						this.HWStatus = false;
					}
				}
			} else {
				item.clickStatus = !item.clickStatus;
				for (let item of this.confirmClosedList) {
					if (item.clickStatus) {
						this.HWStatus = true;
					} else {
						this.HWStatus = false;
					}
				}
			}
		},
		ZTEChannel(item, index) {
			if (index === 0) {
				item.clickStatus = !item.clickStatus;
				for (let item of this.confirmClosedList) {
					if (item.clickStatus) {
						this.ZXStatus = true;
					} else {
						this.ZXStatus = false;
					}
				}
			} else {
				item.clickStatus = !item.clickStatus;
				for (let item of this.confirmClosedList) {
					if (item.clickStatus) {
						this.ZXStatus = true;
					} else {
						this.ZXStatus = false;
					}
				}
			}
		},
		//获取操作日志
		getRecordList() {
			let params = {
				startTime: moment().subtract('hours', 23).format('YYYY-MM-DD HH:mm:ss'),
				endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
				keywords: '',
			};
			record.getRecordList(params).then((res) => {
				if (res.code === 0) {
					this.dataTable = res.data;
				}
			});
		},
		//隔行换色
		rowClassName(record, index) {
			if (index % 2 === 1) {
				let className = '';
				className = 'activit_ant_table_row';
				return className;
			}
		},
		getWindowSize() {
			if (this.windowSize <= 1600 && this.windowSize > 1440) {
				this.scroll.y = 110;
			} else if (this.windowSize <= 1440 && this.windowSize > 1366) {
				this.scroll.y = 104;
			} else if (this.windowSize <= 1366) {
				this.scroll.y = 80;
			} else {
				this.scroll.y = 114;
			}
			if (JSON.parse(sessionStorage.getItem('userInfo')).operatingAuth === 0) {
				this.showBtn = false;
			}
			this.getChannelList(1);
			this.getRecordList();
		},
	},
	mounted() {
		this.getWindowSize();
	},
};
</script>

<style lang="scss" scope>
.shutDown{
  width: 100%;
  height: 92%;
  color: #fff;
  .shutDownBody{
    width: 100%;
    height: 74.22%;
    @include flex-type(space-around,center);
    .leftBody{
      width: 71.72%;
      height: 100%;
      margin-right: 0.53%;
      background: url('../assets/images/左侧-bg@2x.png') no-repeat center;
      background-size: 100% 100%;
      .title{
        width:15.251%;
        height: 6.956%;
        @include flex-type(space-around,center);
        p{
          font-size: 1.33rem;
          font-weight: 400;
          color: #FFFFFF;
          margin-bottom: 0 !important;
        }
      }
      .search{
        width: 96%;
        height: 4.927%;
        @include flex-type('',center);
        margin: 0 auto;
        margin-top: 1.31%;
        .ant-input-affix-wrapper{
          .ant-input{
            width: 24rem;
          }
        }
        img{
         width:1.6rem;
         height:1.6rem;
         cursor: pointer;
        }
        .defaultBatch{
          width: 90px;
          height: 88.24%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          background: #0C408C;
          @include flex-type(center,center);
          cursor: pointer;
        }
        .selectBatch{
          width: 90px;
          height: 88.24%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          background: #0D84DF;
          @include flex-type(center,center);
        }
        div:nth-child(2){
          margin-left: 20px;
          height: 88.24%;
        }
        div:nth-child(3){
          width: 90px;
          height: 88.24%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          @include flex-type(center,center);
          background: #0C408C;
          margin-left:auto;
          cursor: pointer;
        }
        @media (max-width:1600px) {
          div:nth-child(3){
             margin-left:45%;
          }
        }
        div:nth-child(4){
          width: 90px;
          height: 88.24%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          @include flex-type(center,center);
          background: #0C408C;
          margin-left:10px;
        }
      }
      .importantList{
        width: 96%;
        height: 42.9%;
        margin: 0 auto;
        margin-top: 1rem;
        background: #062659;
        @include radius(6px);
        .leftDivHeader{
          width: 100%;
          height: 13.512%;
          background: #04408a;
          box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.35);
          border-radius: 6px 6px 0px 0px;
          @include flex-type('',center);
          p{
            font-size: 1.2rem;
            color: #fff!important;
            margin: 0;
            margin-left: 28px;
            font-weight: 500;
          }
          .defaultAll{ //全选
            width: 6.204%;
            height: 80%;
            font-size: 1rem;
            margin-right: 18px;
            margin-left: auto;
            background: #0C408C;
            border: 1px solid #2287FB;
            @include radius(3px);
            color: #fff;
            @include flex-type(center,center);
            cursor: pointer;
          }
          .selectAll{
            width: 80px;
            height: 30px;
            font-size: 1rem;
            margin-right: 18px;
            margin-left: auto;
            background: rgba(13, 132, 223, 1);
            border: 1px solid #2287FB;
            @include radius(3px);
            color: #fff;
            line-height: 30px;
            cursor: pointer;
          }
        }
        .leftDivBody{
          width: 100%;
          height: calc(100% - 13.512%);
          overflow: auto;
          padding-left: 2.2%;
          &::-webkit-scrollbar{
            width: 6px;
          }
          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 3px;
            background   :#0C72C4;
          }
          &::-webkit-scrollbar-track{
            background: #04418B;
          }
          
          div{
            float: left;
            margin: 1% 1.83% 0 0;
            width: 9.17%;
            height: 14.06%;
            .defaultChannel{
              background: #0C408C;
              @include radius(6px);
              cursor: pointer;
              width: 100%;
              height: 2.4rem;
              line-height: 2.4rem;
              @include ellipsis;
              font-size: 1.2rem;
              font-weight: 400;
              padding: 0 0.67rem;
            }
            .selectChannel{
              background: rgba(13, 132, 223, 1);
              @include radius(6px);
              cursor: pointer;
              font-size: 1.2rem;
              font-weight: 400;
              width: 100%;
              height: 2.4rem;
              line-height: 2.4rem;
              @include ellipsis;
              font-size: 1.2rem;
              font-weight: 400;
              padding: 0 0.67rem;
            } 
          }
        }
      }
      .otherList{
        height: 35.8%;
        .leftDivHeader{
          height: 16.192%!important;
        }
        .bottom_channel{
          height: 17.39%!important;
        }
        .leftDivBody{
          height: calc(100% - 16.192%)!important;
        }
      }
    }
    .rightBody{
      width: 27.29%;
      height: 100%;
      background: url('../assets/images/右侧-bg@2x.png') no-repeat center;
      background-size: 100% 100%;
      .title{
        width:40.08% ;
        height: 6.957%;
        @include flex-type(space-around,center);
        p{
          font-size: 1.33rem;
          font-weight: 400;
          color: #FFFFFF;
          margin-bottom: 0 !important;
        }
      }
      .search{
        width: 90.8%;
        height: 4.927%;
        margin: 0 auto;
        @include flex-type(space-between,center);
        margin-top: 3.44%;
        .ant-input-affix-wrapper{
          .ant-input{
            width: 15.333rem;
          }
        }
        img{
          width:1.6rem;
          height:1.6rem;
          cursor: pointer;
        }
        .ant-input-affix-wrapper {
          width: 15.466rem !important;
          height: 2.133rem;
          color: #fff;
          .ant-input {
            height: 2.133rem !important;
            border: none !important;
            color: #fff;
            background: rgb(8, 53, 111);
          }
        }
        .defaultBatchClosed{
          width: 18.92%;
          height: 93.75%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          background: #0C408C;
          @include flex-type(center,center);
          margin-left: 1rem;
          cursor: pointer;
        }
        .selectBatchClosed{
          width: 18.92%;
          height: 93.75%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          background: #0D84DF;
          @include flex-type(center,center);
          cursor: pointer;
          margin-left: 1rem;
        }
        
        div:nth-child(3){
          width: 18.92%;
          height: 93.75%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          @include radius(3px);
          background: #0C408C;
          @include flex-type(center,center);
          margin-left:5.46%;
        }
      }
      .importantList{
        width: 90.8%;
        height: calc(100% - 130px);
        margin: 0 auto;
        margin-top: 1rem;
        background: #062659;
        @include radius(6px);
        .leftDivHeader{
          width: 100%;
          height:7.142%;
          background: #04408a;
          box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.35);
          border-radius: 6px 6px 0px 0px;
          @include flex-type('',center);
          p{
            font-size: 1.2rem;
            color: #fff!important;
            margin: 0;
            margin-left: 1rem;
            font-weight: 500;
          }
          .defaultAll{ //全选
            width: 17.238%;
            height: 75%;
            font-size: 1rem;
            margin-right: 18px;
            margin-left: auto;
            background: #0C408C;
            border: 1px solid #2287FB;
            @include radius(3px);
            color: #fff;
            @include flex-type(center,center);
            cursor: pointer;
          }
          .selectAll{
            width: 17.238%;
            height: 75%;
            font-size: 1rem;
            margin-right: 18px;
            margin-left:auto;
            background: rgba(13, 132, 223, 1);
            border: 1px solid #2287FB;
            @include radius(3px);
            color: #fff;
            @include flex-type(center,center);
            cursor: pointer;
          }
        }
        .leftDivBody{
          width: 100%;
          height: calc(100% - 7.142%);
          overflow: auto;
          padding-left: 8%;
          &::-webkit-scrollbar{
            width: 6px;
          }
          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 3px;
            background   :#0C72C4;
          }
          &::-webkit-scrollbar-track{
            background: #04418B;
          }
          
          div{
            float: left;     
            margin: 2.8% 5.1% 0 0;
            width: 26.96%;
            height: 6.924%;
            .defaultChannel{
              @include radius(6px);
              background: #0C408C;
              cursor: pointer;
              width: 100%;
              height: 2.4rem;
              line-height: 2.4rem;
              @include ellipsis;
              font-size: 1.2rem;
              font-weight: 400;
              padding: 0 0.67rem;
            }
            .selectChannel{
              background: rgba(13, 132, 223, 1);
              @include radius(6px);
              cursor: pointer;
              width: 100%;
              height: 2.4rem;
              line-height: 2.4rem;
              @include ellipsis;
              font-size: 1.2rem;
              font-weight: 400;
              padding: 0 0.67rem;
            }
          }
        }
      }
    }
  }
  .ant-modal{
    width: 94.667rem !important;
    height: 51.926rem!important;
    .action{
      width: 100%;
      height: 2.533rem;
      @include flex-type('',center);
      span{
        @include flex-type(center,center);
        width: 8rem;
        height: 2.533rem;
        font-size: 1.1rem;
        background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
        background-size: 100% 100%;
        border-radius: 6px;
        color: #48B0FF;
        margin:0 3rem 0 3.2rem;
        font-size: 1.2rem;
      }
      p{
        @include flex-type(center,center);
        font-size: 1.33rem;
        color: #fff;
        margin:0;
      }
    }
    .executeObj{
      height: 14.667rem;
      margin-top: 1.333rem;
      span{
        @include flex-type(center,center);
        width: 8rem;
        height: 2.533rem;
        font-size: 1.1rem;
        background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
        background-size: 100% 100%;
        border-radius: 6px;
        color: #48B0FF;
        margin:0 3rem 0 3.2rem;
        float: left;
        font-size: 1.2rem;
      }
      .defaultP{
        @include ellipsis;
        width: 6.667rem;
        height: 2.533rem;
        text-align: center;
        line-height: 2.533rem;
        font-size: 1.33rem;
        color: #fff;
        background: #0C408C;
        margin:0;
        border-radius: 8px;
        float: left;
        margin-right: 0.667rem;
        font-weight: 500;
        
      }
      .selectP{
        @include ellipsis;
        width: 6.667rem;
        height: 2.533rem;
        text-align: center;
        line-height: 2.533rem;
        font-size: 1.33rem;
        color: #fff;
        background: rgba(13, 132, 223, 1);
        margin:0;
        border-radius: 8px;
        float: left;
        margin-right: 0.667rem;
        font-weight: 500;
      }
      .channel{
        width: 68rem;
        height: 14.667rem;
        float: left;
        overflow: auto;
        &::-webkit-scrollbar{
              width: 6px;
            }
            &::-webkit-scrollbar-thumb {
              /*滚动条里面小方块*/
              border-radius: 3px;
              background   :#0C72C4;
            }
            &::-webkit-scrollbar-track{
              background: #04418B;
            }
      }
      .defaultChannel{
        float: left;
        width: 6.667rem;
        height: 2.533rem;
        font-size: 1.0667rem;
        background: #0C408C;
        border-radius: 6px;
        margin: 0 1.333rem 1.266rem 0;
        color: #fff;
        line-height: 2.533rem;
        @include ellipsis;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 0 0.67rem;
        cursor: pointer;
      }
      .selectChannel{
        float: left;
        width: 6.667rem;
        height: 2.533rem;
        font-size: 1.0667rem;
        background: rgba(13, 132, 223, 1);
        border-radius: 6px;
        margin: 0 1.333rem 1.266rem 0;
        color: #fff;
        line-height: 2.533rem;
        @include ellipsis;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 0 0.67rem;
        cursor: pointer;
      }
    }
    .executeObjZX{
      height: 14.667rem;
      margin-top: 1.333rem;
      
      .defaultP{
        @include flex-type(center,center);
        width: 6.667rem;
        height: 2.533rem;
        font-size: 1.33rem;
        color: #fff;
        background: #0C408C;
        margin:0;
        border-radius: 8px;
        float: left;
        margin-right: 0.667rem;
        margin-left: 14.2rem;
        font-weight: 500;
      }
      .selectP{
        @include flex-type(center,center);
        width: 6.667rem;
        height: 2.533rem;
        font-size: 1.33rem;
        color: #fff;
        background: rgba(13, 132, 223, 1);
        margin:0;
        border-radius: 8px;
        float: left;
        margin-right: 0.667rem;
        margin-left: 14.2rem;
        font-weight: 500;
      }
      .channel{
        width: 68rem;
        height: 14.667rem;
        float: left;
        overflow: auto;
        &::-webkit-scrollbar{
              width: 6px;
            }
            &::-webkit-scrollbar-thumb {
              /*滚动条里面小方块*/
              border-radius: 3px;
              background   :#0C72C4;
            }
            &::-webkit-scrollbar-track{
              background: #04418B;
            }
      }
      .defaultChannel{
        float: left;
        width: 6.667rem;
        height: 2.533rem;
        font-size: 1.0667rem;
        background: #0C408C;
        border-radius: 6px;
        margin: 0 1.333rem 1.266rem 0;
        color: #fff;
        line-height: 2.533rem;
        @include ellipsis;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 0 0.67rem;
        cursor: pointer;
      }
      
      .selectChannel{
        float: left;
        width: 6.667rem;
        height: 2.533rem;
        font-size: 16px;
        background: rgba(13, 132, 223, 1);
        border-radius: 6px;
        margin: 0 1.333rem 1.266rem 0;
        color: #fff;
        line-height: 2.533rem;
        @include ellipsis;
        font-size: 1.2rem;
        font-weight: 400;
        padding: 0 0.67rem;
        cursor: pointer;
      }
    }
    .time{
      width: 1420px;
      height: 38px;
      @include flex-type('',center);
      span{
        @include flex-type(center,center);
        width: 8rem;
        height: 2.533rem;
        font-size: 1.1rem;
        background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
        background-size: 100% 100%;
        border-radius: 6px;
        color: #48B0FF;
        margin:0 3rem 0 3.2rem;
        font-size: 1.2rem;
      }
      p{
        @include flex-type(center,center);
        font-size: 1.33rem;
        color: #fff;
        margin:0;
      }
    }
    .operator{
      width: 94.667rem;
      height: 2.533rem;
      @include flex-type('',center);
      margin-top: 1.333rem;
      span:nth-child(1){
        @include flex-type(center,center);
        width: 8rem;
        height: 2.533rem;
        font-size: 1.1rem;
        background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
        background-size: 100% 100%;
        border-radius: 6px;
        color: #48B0FF;
        margin:0 2rem 0 3.2rem;
        font-size: 1.2rem;
      }
      p{
        text-align: center;
        @include ellipsis;
        font-size: 1.33rem;
        color: #fff;
        margin:0;
        width: 9rem;
      }
      label{
        @include flex-type(center,center);
        width: 8rem;
        height: 2.533rem;
        font-size: 1.33rem;
        color:#fff;
        
      }
      .ant-input-affix-wrapper{
        width: 20.4rem;
        height: 2.533rem;
        background: rgba(1, 42, 87, 0.54);
        border: 1px solid #185FC6;
        border-radius: 5px;
        color: #fff;
        .ant-input{
          width: 100%;
          height: 2.433rem!important;
        }
      }
      .ant-input{
        width: 19.4rem;
        background: rgba(1, 42, 87, 0.54);
        border: 1px solid #185FC6;
        color: #fff;
      }
      .borderClass{
        width: 14rem;
        color:#fff;
        padding-left: 15px;
      }
    }
  }
  .shutDownFoot{
    width: 97.86%;
    height: 25.19%;
    background: url('../assets/images/操作记录-bg@2x.png') no-repeat center;
    background-size: 100% 100%;
    margin: 0 auto;
    .footHeader{
      width:100% ;
      height: 22.324%;
        @include flex-type(center,center);
        p{
          font-size: 1.33rem;
          font-weight: 500;
          color: #FFFFFF;
          margin-bottom: 0 !important;
        }
    }
    .footTable{
      width: 100%;
      .ant-table{
        width: 99%;
        margin: 0 auto;
        .ant-table-placeholder{
          display: none;
        }
      }
      .activit_ant_table_row{
        background: rgba(2, 17, 44, 1);
        color: #fff;
      }
    }
    .ant-modal{
      width: 54.667rem !important;
      height: 41.926rem!important;
      .action{
        width: 35.667rem;
        height: 2.533rem;
        margin:0 auto;
        @include flex-type('',center);
        span{
          @include flex-type(center,center);
          width: 8rem;
          height: 2.533rem;
          font-size: 1.1rem;
          background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
          background-size: 100% 100%;
          border-radius: 6px;
          color: #48B0FF;
          margin:0 3rem 0 3.2rem;
          font-size: 1.2rem;
        }
        p{
          @include flex-type(center,center);
          font-size: 1.33rem;
          color: #fff;
          margin:0;
        }
      }
      .time{
        width: 35.667rem;
        height: 38px;
        margin:0 auto;
        margin-top: 1.333rem;
        @include flex-type('',center);
        span{
          @include flex-type(center,center);
          width: 8rem;
          height: 2.533rem;
          font-size: 1.1rem;
          background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
          background-size: 100% 100%;
          border-radius: 6px;
          color: #48B0FF;
          margin:0 3rem 0 3.2rem;
          font-size: 1.2rem;
        }
        p{
          @include flex-type(center,center);
          font-size: 1.33rem;
          color: #fff;
          margin:0;
        }
      }
      .operator{
        width: 35.667rem;
        height: 2.533rem;
        margin:0 auto;
        @include flex-type('',center);
        margin-top: 1.333rem;
        span:nth-child(1){
          @include flex-type(center,center);
          width: 8rem;
          height: 2.533rem;
          font-size: 1.1rem;
          background: url('../assets/images/矩形 59 拷贝@2x.png') no-repeat center;
          background-size: 100% 100%;
          border-radius: 6px;
          color: #48B0FF;
          margin:0 2rem 0 3.2rem;
          font-size: 1.2rem;
        }
        div{
          width: 20rem;
        }
        .ant-input-affix-wrapper{
          width: 20.4rem;
          height: 2.533rem;
          background: rgba(1, 42, 87, 0.54);
          border: 1px solid #185FC6;
          border-radius: 5px;
          color: #fff;
          .ant-input{
            width: 100%;
            height: 2.433rem!important;
          }
        }
        .ant-input{
          width: 19.4rem;
          background: rgba(1, 42, 87, 0.54);
          border: 1px solid #185FC6;
          color: #fff;
        }
      }
    }
  }
  
  
}
  
</style>
