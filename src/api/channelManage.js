/*
*   首页管理模块接口列表
*/

import { post } from '../utils/http'
import base from './base'

const channelManage = {
  //获取频道列表
  getChannelList: params => post(`${base.index.getChannelList}`, params),
  //一键关停
  closed: params => post(`${base.index.closed}`, params),
  //一键恢复
  recover: params => post(`${base.index.recover}`, params),
  //编辑频道信息
  updateChannelInfo: params => post(`${base.index.updateChannelInfo}`, params),
  //删除频道
  deleteChannelByIds: params => post(`${base.index.deleteChannelByIds}`, params),
  //批量分组
  setChannelGroup: params => post(`${base.index.setChannelGroup}`, params),
}
export default channelManage