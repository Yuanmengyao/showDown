/*
*   首页管理模块接口列表
*/

import { post } from '../utils/http'
import base from './base'

const recordLog = {
  //获取操作记录
  getRecordList: params => post(`${base.record.getRecordList}`, params),
  //操作记录复核
  reviewer: params => post(`${base.record.reviewer}`, params),
  //导出操作记录
  exportRecordHistory: params => post(`${base.record.exportRecordHistory}`, params),
}
export default recordLog