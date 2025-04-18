import request from '@/utils/request';
// 电话列表
export function getPhoneList(data) {
  return request({
    url: '/convenience/pagelist',
    method: 'post',
    data
  })
}
// 电话列表添加
export function putPhone(data) {
  return request({
    url: '/convenience/edit',
    method: 'post',
    data
  })
}

// 电话列表删除
export function delPhone(params) {
  return request({
    url: '/convenience/del',
    method: 'get',
    params
  })
}
// 电话列表详情
export function getPhoneInfo(params) {
  return request({
    url: '/convenience/info',
    method: 'get',
    params
  })
}


// 办事指南
export function getGuideList(data) {
  return request({
    url: '/guidelines/pagelist',
    method: 'post',
    data
  })
}
// 办事指南添加
export function putGuide(data) {
  return request({
    url: '/guidelines/edit',
    method: 'post',
    data
  })
}

// 办事指南删除
export function delGuide(params) {
  return request({
    url: '/guidelines/del',
    method: 'get',
    params
  })
}
// 办事指南详情
export function getGuideInfo(params) {
  return request({
    url: '/guidelines/info',
    method: 'get',
    params
  })
}



