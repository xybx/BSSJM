import request from '@/utils/request'

export function getRouterList(params) {
  return request({
    url: '/user/vuemenu',
    method: 'get',
    params,
  })
}
