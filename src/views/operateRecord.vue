<template>
	<div class="operate">
		<div class="search">
			<label for="">开始时间:</label>
			<a-date-picker
				placeholder="请选择日期"
				:format="dateFormat"
				:allowClear="false"
				v-model="logTimeStart"
				show-time
			>

				<template slot="suffixIcon">
					<img src="../assets/images/timeIcon.png">
				</template>
			</a-date-picker>
			<label for="">结束时间:</label>
			<a-date-picker
				placeholder="请选择日期"
				v-model="logTimeEnd"
				:format="dateFormat"
				show-time
				:allowClear="false"
			>
				<template slot="suffixIcon">
					<img src="../assets/images/timeIcon.png">
				</template>
			</a-date-picker>
			<label for="">关键词:</label>
			<a-input
				placeholder="请输入频道名称"
				v-model="channelDesc"
			>
				<img
					src="../assets/images/搜索-icon@2x.png"
					alt=""
					slot="suffix"
				>
			</a-input>
			<label
				for=""
				style="margin-right:0.5rem"
			>所属平台:</label>
			<a-select v-model="queryChannel">
				<a-select-option :value="0">全部</a-select-option>
				<a-select-option :value="1">华为平台</a-select-option>
				<a-select-option :value="2">中兴平台</a-select-option>
			</a-select>
			<a-button @click="selectChannel">查询</a-button>

			<a-button
				@click="exportLog"
				style="margin-right:1rem"
			>导出</a-button>
		</div>
		<div
			class="tableWrap"
			ref="tableWrap"
		>
			<a-table
				:columns="columnsLog"
				:data-source="dataTable"
				:rowClassName="rowClassName"
				:pagination="pagination"
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
					<div>{{text?text:'--'}}</div>
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
				:visible="reviewerVisible"
				@cancel="canleDialog"
				:centered="true"
				:maskClosable="false"
				title="复核确认"
				:getContainer="() => $refs.tableWrap"
				@ok="reviewerIdea"
			>
				<div class="action"><span>执行动作</span>
					<p>复核意见确认</p>
				</div>
				<div class="time"><span>执行时间</span>
					<p>{{dataTime}}</p>
				</div>
				<div class="operator">
					<span>复核员</span>
					<div style="color:#fff">{{this.name}}</div>
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
					style="height:6rem"
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
						style="color:#fff"
					>{{this.reviewerOpinion}}</div>
				</div>
			</a-modal>
		</div>
	</div>
</template>
<script>
import channel from '../utils/channel.js';
import record from '../api/recordLog';
import moment from 'moment';
import { Encryption } from '../utils/encryption';
const encryption = new Encryption();
export default {
	data() {
		return {
			channelDesc: '',
			queryChannel: 0,
			logTimeStart: null,
			logTimeEnd: null,
			dateFormat: 'YYYY/MM/DD HH:mm:ss',
			moment,
			columnsLog: channel.columnsLog,
			dataTable: [],
			pageNo: 1,
			pageSize: 20,
			pagination: {
				defaultCurrent: 1,
				defaultPageSize: 18,
				total: 20,
				pageNo: 1,
				pageSize: 20,
				showTotal: (total) => `共${total}条记录`,
				showSizeChanger: true,
				pageSizeOptions: ['18', '20', '25'], // 每页数量选项
				onShowSizeChange: (current, pageSize) => {
					this.pageSize = pageSize;
					this.getRecordList(current, pageSize);
				}, // 改变每页数量时更新显示
				onChange: (pageNo, pageSize) => this.getRecordList(pageNo, pageSize), //点击页码事件
			},
			reviewerVisible: false,
			reviewerPwd: null,
			reviewerOpinion: null,
			currentLog: null,
			dataTime: null,
			timer: null,
			name: null,
			currentReviewer: true, //当前复核人是否为登录用户
		};
	},
	methods: {
		initTime() {
			let startTime = moment().startOf('day');
			let endTime = moment().endOf('day');
			this.logTimeStart = startTime;
			this.logTimeEnd = endTime;
			this.getRecordList(1, 20);
		},
		selectChannel() {
			this.getRecordList(this.pageNo, this.pageSize);
		},
		showDialog(item) {
			this.timer && clearInterval(this.timer);
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
				this.name = this.currentLog.reviewer;
				this.dataTime = this.currentLog.reviewerTime;
				this.reviewerOpinion = this.currentLog.reviewIdea;
				this.reviewerVisible = !this.reviewerVisible;
			} else {
				const that = this;
				that.name = JSON.parse(sessionStorage.getItem('userInfo')).userAlias;
				that.timer = setInterval(function () {
					that.dataTime = moment().format('YYYY-MM-DD HH:mm:ss');
				}, 1000);
				this.currentReviewer = true;
				that.reviewerVisible = !that.reviewerVisible;
			}
		},
		getRecordList(pageNo, pageSize) {
			let params = {
				pageNo,
				pageSize,
				startTime: this.logTimeStart.format('YYYY-MM-DD HH:mm:ss'),
				endTime: this.logTimeEnd.format('YYYY-MM-DD HH:mm:ss'),
				keywords: this.channelDesc || '',
				platform: this.queryChannel || '',
			};
			this.pageNo = pageNo;
			this.pageSize = pageSize;
			record.getRecordList(params).then((res) => {
				if (res.code === 0) {
					this.dataTable = res.data;
					this.pagination.total = res.extends.total;
					this.$message.success('操作记录查询成功');
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		canleDialog() {
			this.reviewerOpinion = null;
			this.reviewerVisible = !this.reviewerVisible;
			clearInterval(this.timer);
		},
		reviewerIdea() {
			let { id } = this.currentLog;
			let params = {
				id,
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
					if (JSON.parse(sessionStorage.getItem('userInfo')).id !== id) {
						record.reviewer(params).then((res) => {
							if (res.code === 0) {
								this.getRecordList();
								this.$message.success('复核成功');
								this.reviewerPwd = null;
								this.reviewerOpinion = null;
								this.reviewerVisible = !this.reviewerVisible;
								clearInterval(this.timer);
							} else {
								this.$message.error(res.msg);
							}
						});
					} else {
						this.$message.error('操作人不可复核自己的操作记录');
					}
				} else {
					this.$message.warn('密码不正确或复核条件为空');
				}
			} else {
				this.$message.warn('当前操作记录你没有复核权限');
			}
		},

		exportLog() {
			let params = {
				platform: this.queryChannel,
				startTime: this.logTimeStart.format('YYYY-MM-DD HH:mm:ss'),
				endTime: this.logTimeEnd.format('YYYY-MM-DD HH:mm:ss'),
			};
			if (this.queryChannel === 0) {
				let url = `operatingRecord/exportRecordHistory?startTime=${params.startTime}&endTime=${params.endTime}`;
				window.open(url);
			} else {
				let url = `operatingRecord/exportRecordHistory?startTime=${params.startTime}&endTime=${params.endTime}&platform=${this.queryChannel}`;
				window.open(url);
			}
		},

		rowClassName(record, index) {
			if (index % 2 === 1) {
				let className = '';
				className = 'activit_ant_table_row';
				return className;
			}
		},
	},
	mounted() {
		this.initTime();
	},
};
</script>
<style lang="scss" scope>
.operate{
  width: 100%;
  height: 92%;
  color: #fff;
  .search{
    width: 100%;
    height: 6%;
    @include flex-type('',center);
    border: 2px solid #04408a;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 0.5%;
    position: relative;
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
    .channelSync{
      width: 7rem;
      margin-left: auto;
    }
    img{
      width:1.6rem;
      height:1.6rem;
      cursor: pointer;
    }
  }
  .tableWrap{
    width: 100%;
    height: 93.5%;
    .ant-table-content{
      width: 100%;
      margin: 0 auto;
      .ant-table-thead{
        tr{
          th{
            height: 2.667rem;
            padding: 0 16px;
            background: #11519f;
            color: #fff;
            border: none;
            
          }
        }
      }
      .ant-table-tbody{
        height: 48rem!important;
        overflow-y: auto;
      }
      .ant-table-placeholder{
        display: none;
      }
    }
    .activit_ant_table_row{
      background: rgba(2, 17, 44, 1)!important;
      color: #fff;
    }

    .ant-modal{
      width: 50.667rem !important;
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