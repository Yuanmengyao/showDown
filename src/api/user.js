/*
*   用户管理模块接口列表
*/

import { post } from '../utils/http'
import base from './base'

const user = {
  //登录
  login: params => post(`${base.user.login}`, params),
  //编辑
  saveOrUpdateUser: params => post(`${base.user.saveOrUpdateUser}`, params),
  //删除
  deleteUsers: params => post(`${base.user.deleteUsers}`, params),
  //查询
  getUserList: params => post(`${base.user.getUserList}`, params),
  //查询单个
  get: params => post(`${base.user.get}`, params),
  //修改密码
  updateUserpassword: params => post(`${base.user.updateUserpassword}`, params)
}
export default user