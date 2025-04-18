import request from '@/utils/request';

//列表
export function getTaskList(data) {
  return request({
    url: '/snapshot/allsnapshot',
    method: 'post',
    data
  })
}
//详情
export function getTaskTail(params) {
  return request({
    url: '/snapshot/id',
    method: 'get',
    params
  })
}
//类别
export function getTaskCategory() {
  return request({
    url: '/snapshot/matterTypeList',
    method: 'get',
  })
}
//流程
export function getTaskIdea(params) {
  return request({
    url: '/snapshot/idea',
    method: 'get',
    params
  })
}
//待办
export function getbehandleList(data) {
  return request({
    url: '/snapshot/behandle',
    method: 'post',
    data
  })
}
//用户列表
export function getUserList() {
  return request({
    url: '/snapshot/users',
    method: 'get',
  })
}
//转办
export function putTransfer(params) {
  return request({
    url: '/snapshot/turn',
    method: 'get',
    params
  })
}
//办理
export function putHandle(params) {
  return request({
    url: '/snapshot/handle',
    method: 'get',
    params
  })
}
//作废
export function putReject(params) {
  return request({
    url: '/snapshot/zuofei',
    method: 'get',
    params
  })
}

//待审
export function getVoverList(data) {
  return request({
    url: '/snapshot/beshenhe',
    method: 'post',
    data
  })
}
//已审
export function getVendList(data) {
  return request({
    url: '/snapshot/hasshenhe',
    method: 'post',
    data
  })
}
//审核
export function putVerify(params) {
  return request({
    url: '/snapshot/shenhe',
    method: 'get',
    params
  })
}

//数据统计
export function getMatterNum() {
  return request({
    url: '/snapshotcount/mattercount',
    method: 'get'
  })
}

//处理事项回复率
export function getAnswner() {
  return request({
    url: '/snapshotcount/huifulv',
    method: 'get'
  })
}
// 年度类别事项统计
export function getEventTotal(params) {
  return request({
    url: '/snapshotcount/leibieshi',
    method: 'get'
  })
}
//本年度月事项上报情况
export function getMouthYear(params) {
  return request({
    url: '/snapshotcount/yearmonth',
    method: 'get',
    params
  })
}

//本年度镇街扫码分析
export function getMouthNum(params) {
  return request({
    url: '/snapshotcount/allmonth',
    method: 'get',
    params
  })
}
//镇街
export function getAreas() {
  return request({
    url: '/snapshotcount/areas',
    method: 'get'
  })
}
//镇街
export const getMatterList = ()=>{
  return request({
    url: '/snapshotcount/nmattercount',
    method: 'get'
  })
}
//镇街
export const getByareaList = ()=>{
  return request({
    url: '/snapshotcount/listbyareas',
    method: 'get'
  })
}



