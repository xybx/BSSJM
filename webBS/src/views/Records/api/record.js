import request from '@/utils/request';

//打卡
export const getSignupList = (params)=>{
  return request({
    url: '/policesigncount/list',
    method: 'get',
    params
  })
}

//打卡查看
export const getSignId = (params)=>{
  return request({
    url: '/policesigncount/byid',
    method: 'get',
    params
  })
}

//打卡类型
export const getSignCategory = ()=>{
  return request({
    url: '/policesigncount/signtype',
    method: 'get',
  })
}
