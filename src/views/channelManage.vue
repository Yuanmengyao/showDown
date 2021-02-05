<template>
	<div class="channelManage">
		<div class="searchs">
			<label for="">关键词:</label>
			<a-input
				v-model="channelDesc"
				placeholder="请输入频道名称"
				@keyup.enter="selectChannel"
			>
				<img
					src="../assets/images/搜索-icon@2x.png"
					alt=""
					slot="suffix"
					@click="selectChannel"
				>
			</a-input>
			<label
				for=""
				style="margin-right:0.5rem"
			>频道分组:</label>
			<a-select v-model="queryChannel">
				<a-select-option :value="0">全部</a-select-option>
				<a-select-option :value="1">重要</a-select-option>
				<a-select-option :value="2">其他</a-select-option>
				<a-select-option :value="3">无</a-select-option>
			</a-select>
			<label
				for=""
				style="margin-right:0.5rem"
			>业务平台:</label>
			<a-select v-model="queryPlatform">
				<a-select-option :value="0">全部</a-select-option>
				<a-select-option :value="1">华为平台</a-select-option>
				<a-select-option :value="2">中兴平台</a-select-option>
			</a-select>
			<a-button
				@click="selectChannel"
				style="width:5.667rem"
			>查询</a-button>
			<a-button
				@click="showGroup"
				style="margin-left: auto;"
			>批量分组</a-button>
			<a-button @click="deleteGroup">批量删除</a-button>
			<a-button
				class="channelSync"
				style="margin-right:1rem;"
				@click="channelSync"
			>频道同步</a-button>
			<a-modal
				:visible="isShowGroup"
				@cancel="canleGroup"
				:centered="true"
				:maskClosable="false"
				title="选择分组"
				@ok="clickGroup"
			>
				<div style="margin:0 auto;display:flex;justify-content: center;align-items: center;">
					<label
						for=""
						style="margin-right:0.5rem;color:#fff;"
					>频道分组:</label>
					<a-select v-model="groupChannel">
						<a-select-option :value="1">重要</a-select-option>
						<a-select-option :value="2">其他</a-select-option>
					</a-select>
				</div>

			</a-modal>
		</div>
		<div
			class="tableWrap"
			ref="tableWrap"
		>
			<a-table
				:columns="columnsLog"
				:data-source="dataTable"
				:rowClassName="rowClassName"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				:pagination="pagination"
				:rowKey="(record)=>record.id"
			>
				<template
					slot="groupId"
					slot-scope="record"
				>
					<a-tooltip
						:title="record"
						:destroyTooltipOnHide="true"
					>
						<div>{{record==3?'无':(record==1?'重要':'其他')}}</div>
					</a-tooltip>

				</template>
				<template
					slot="platform"
					slot-scope="record"
				>
					<div>{{record==1?'华为':'中兴'}}</div>
				</template>
				<template
					slot="operational"
					slot-scope="record,index"
				>
					<span
						class="iconfont"
						style="font-size:1.33rem;margin:0 20px 0 0;cursor:pointer"
						@click="showDialog(index)"
					>&#xe62f;</span>
					<span
						class="iconfont"
						style="font-size:1.33rem;margin-left:10px;cursor:pointer"
						@click="deleteChannel(index)"
					>&#xe659;</span>
				</template>
			</a-table>
			<a-modal
				:visible="isShowEdit"
				@cancel="canleDialog"
				:centered="true"
				:maskClosable="false"
				title="编辑频道信息"
				:getContainer="() => $refs.tableWrap"
				@ok="editChannelInfo"
			>
				<div class="editDiv">
					<label for="">频道名称:</label>
					<p>{{diaChannelName}}</p>
				</div>
				<div class="editDiv">
					<label for="">频道别名:</label>
					<a-input v-model="changeAlias"></a-input>
				</div>
				<div class="editDiv">
					<label for="">频道分组:</label>
					<a-select v-model="diaChannelGroup">
						<a-select-option :value="1">重要</a-select-option>
						<a-select-option :value="2">其他</a-select-option>
						<a-select-option :value="3">无</a-select-option>
					</a-select>
				</div>

			</a-modal>
		</div>

	</div>
</template>
<script>
import channel from '../utils/channel.js';
import channelManage from '../api/channelManage';
export default {
	data() {
		return {
			columnsLog: channel.channelTitle,
			dataTable: [],
			selectedRowKeys: [],
			isShowGroup: false,
			groupChannel: 1,
			idList: [],
			channelDesc: '',
			queryChannel: 0,
			queryPlatform: 0,
			pagination: {
				defaultCurrent: 1,
				defaultPageSize: 20,
				total: 0,
				page: 1,
				pageSize: 18,
				showTotal: (total) => `共${total}个频道`,
				showSizeChanger: true,
				pageSizeOptions: ['15', '18', '20'], // 每页数量选项
			},
			isShowEdit: false,
			diaChannelGroup: 3,
			currentChannel: null,
			diaChannelName: null,
			changeAlias: null,
		};
	},
	methods: {
		getChannelList() {
			channelManage.getChannelList().then((res) => {
				if (res.code === 0) {
					this.dataTable = res.data;
					this.dataTable.sort((a, b) => {
						return a.id - b.id;
					});
					this.pagination.total = this.dataTable.length;
					this.$message.success('频道查询成功');
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		onSelectChange(selectedRowKeys, selectedRows) {
			this.idList = [];
			selectedRows.map((item) => {
				this.idList.push(item.id);
			});
			this.selectedRowKeys = selectedRowKeys;
		},
		showGroup() {
			if (this.idList.length > 0) {
				this.isShowGroup = true;
			} else {
				this.$message.warn('请先选择频道');
			}
		},
		canleGroup() {
			this.isShowGroup = false;
		},
		clickGroup() {
			let params = {
				groupId: this.groupChannel,
				channelIds: this.idList.join(','),
			};
			channelManage.setChannelGroup(params).then((res) => {
				if (res.code === 0) {
					this.$message.success('批量分组设置成功');
					this.canleGroup();
					this.getChannelList();
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		selectChannel() {
			let params = {
				keywords: this.channelDesc,
				groupId: this.queryChannel || '',
				platform: this.queryPlatform || '',
			};
			channelManage.getChannelList(params).then((res) => {
				if (res.code === 0) {
					this.dataTable = res.data;
					this.dataTable.sort((a, b) => {
						return a.id - b.id;
					});
					this.pagination.total = this.dataTable.length;
					if (this.dataTable.length == 0) {
						this.$message.success('暂未查询到符合条件的频道');
					}
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		showDialog(item) {
			this.currentChannel = item;
			this.diaChannelName = this.currentChannel.name;
			this.diaChannelGroup = this.currentChannel.groupId;
			this.isShowEdit = !this.isShowEdit;
			if (this.currentChannel.alias) {
				this.changeAlias = this.currentChannel.alias;
			}
		},
		canleDialog() {
			this.isShowEdit = !this.isShowEdit;
		},
		editChannelInfo() {
			this.currentChannel.alias = this.changeAlias;
			this.currentChannel.groupId = this.diaChannelGroup;
			let { id, alias, groupId } = this.currentChannel;
			let params = { id, alias, groupId };
			channelManage.updateChannelInfo(params).then((res) => {
				if (res.code === 0) {
					this.getChannelList();
					this.$message.success('频道信息修改成功');
					this.isShowEdit = !this.isShowEdit;
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		deleteChannel(item) {
			let { id } = item;
			let params = { ids: String(id) };
			this.$confirm({
				title: `确定要删除 ${item.alias} 吗`,
				type: 'warning',
				okText: '确定',
				centered: 'true',
				cancelText: '取消',
				onOk: () => {
					this.deleteChannelByIds(params);
				},
			});
		},
		deleteGroup() {
			if (this.idList.length === 0) {
				this.$message.warn('请先选择要删除的频道');
				return;
			}
			let params = this.idList.join(',');
			this.$confirm({
				title: `确定要删除所选的频道吗`,
				type: 'warning',
				okText: '确定',
				centered: 'true',
				cancelText: '取消',
				onOk: () => {
					this.deleteChannelByIds(params);
				},
			});
		},
		deleteChannelByIds(params) {
			channelManage.deleteChannelByIds(params).then((res) => {
				if (res.code === 0) {
					this.getChannelList();
					this.$message.success('频道删除成功');
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		channelSync() {
			this.$message.info('功能开发中......');
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
		this.getChannelList();
	},
};
</script>
<style lang="scss" scope>
.channelManage{
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
    position: relative;
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
      width: 7rem;
      height: 2.4rem;
      margin-left: 2rem;
      padding: 0 1rem;
      span{
        font-size: 1.1rem;
      }
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
      .ant-modal-body{
        @include flex-type(center,center);
        flex-wrap: wrap;
      }
      .editDiv{
        height: 4rem;
        @include flex-type('',center);
        label{
          width: 6rem;
          height: 2.533rem;
          color: #fff;
          font-size: 1.1rem;
          text-align: center;
          line-height: 2.533rem;
          float: left;
        }
        p{
          width: 19.33rem;
          height: 2.533rem;
          line-height: 2.533rem;
          color: #fff;
          font-size: 1.1rem;
          float: left;
        }
        .ant-select{
          width: 19rem;
        }
      }
      
    }
  }
  
}
  
  
      
</style>