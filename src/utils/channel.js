const columnsLog = [
  {
    key: '时间',
    title: '时间',
    dataIndex: 'operateTime',
    sorter: (a, b) => {
      return Date.parse(a.operateTime) - Date.parse(b.operateTime)
    },
    width: '15%',
    align: 'center'
  },
  {
    key: '业务平台',
    title: '业务平台',
    dataIndex: 'platform',
    scopedSlots: { customRender: 'platform' },
    width: '10%',
    align: 'center'
  },
  {
    key: '频道',
    title: '频道',
    dataIndex: 'channelName',
    width: '10%',
    scopedSlots: { customRender: 'channelName' },
    align: 'center'
  },
  {
    key: '操作情况',
    title: '操作情况',
    dataIndex: 'operational',
    width: '15%',
    align: 'center'
  },
  {
    key: '操作结果',
    title: '操作结果',
    dataIndex: 'result',
    width: '10%',
    align: 'center'
  },
  {
    key: '平台响应描述',
    title: '平台响应描述',
    dataIndex: 'describe',
    width: '25%',
    scopedSlots: { customRender: 'describe' },

  },
  {
    key: '操作员',
    title: '操作员',
    dataIndex: 'operator',
    align: 'center',
    width: '7%',
  },
  {
    key: '复核员',
    title: '复核员',
    dataIndex: 'reviewer',
    scopedSlots: { customRender: 'reviewer' },
    width: '8%',
    align: 'center'
  },
]
const channelTitle = [
  {
    key: '序号',
    title: '序号',
    dataIndex: 'id',
    width: '10%',
    align: 'center'
  },
  {
    key: '频道名称',
    title: '频道名称',
    dataIndex: 'name',
    width: '25%',
    align: 'center',

  },
  {
    key: '频道别名',
    title: '频道别名',
    dataIndex: 'alias',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'alias' },
  },
  {
    key: '业务平台',
    title: '业务平台',
    dataIndex: 'platform',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'platform' },
    sorter: (a, b) => {
      console.log(a, b)
      return a.platform - b.platform
    },
  },
  {
    key: '频道分组',
    title: '频道分组',
    dataIndex: 'groupId',
    width: '15%',
    align: 'center',
    scopedSlots: { customRender: 'groupId' },
  },
  {
    key: '操作',
    title: '操作',
    dataIndex: 'operational',
    width: '20%',
    align: 'center',
    scopedSlots: { customRender: 'operational' },
  },
]
let newChannelList = []
for (let i = 1; i < 60; i++) {
  if (i % 3 == 0) {
    newChannelList.push({
      id: i,
      channelName: `CCTV-${i}`,
      alias: `CCTV-${i}`,
      platform: 1,
      classify: 1,
    })
    continue
  } else if (i % 5 == 0) {
    newChannelList.push({
      id: i,
      channelName: `北京卫视${i}`,
      alias: `北京卫视${i}`,
      platform: 2,
      classify: 3,

    })
    continue
  } else {
    newChannelList.push({
      id: i,
      channelName: `科教卫视${i}`,
      alias: `科教卫视${i}`,
      platform: 2,
      classify: 2,
    })
  }
}
const channelList = newChannelList
export default {
  columnsLog,
  channelTitle,
  channelList
}