/* 
 *   接口域名的管理
 */

const base = {

  /*************   用户管理   **************/
  user: {
    login: '/user/login',
    saveOrUpdateUser: '/user/saveOrUpdateUser',
    getUserList: '/user/getUserList',
    updateUserpassword: '/user/updateUserpassword',
    deleteUsers: '/user/deleteUsers',
    get: '/user/get'

  },

  /*************   频道管理   **************/
  index: {
    getChannelList: '/channel/getChannelList',
    closed: '/channel/closed',
    recover: '/channel/recover',
    updateChannelInfo: '/channel/updateChannelInfo',
    deleteChannelByIds: '/channel/deleteChannelByIds',
    setChannelGroup: 'channel/setChannelGroup',
  },
  record: {
    getRecordList: '/operatingRecord/getRecordList',
    reviewer: 'operatingRecord/reviewer',
    exportRecordHistory: 'operatingRecord/exportRecordHistory',
  }
}

export default base;