import request from '@/utils/request'

export async function login(data) {
  return request({
    url: '/user/Login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/user/userinfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}

export function editPass(params) {
  return request({
    url: '/user/modifypwd',
    method: 'get',
    params
  })
}
// export function getBack(params) {
//   return request({
//     url: '/systemsetting/frontPage',
//     method: 'get',
//     params
//   })
// }
// export function getHome(params) {
//   return request({
//     url: '/systemsetting/frontpageparentlist',
//     method: 'get',
//     params
//   })
// }
// export function getHomelist(params) {
//   return request({
//     url: '/systemsetting/frontpagelist',
//     method: 'get',
//     params
//   })
// }
// export function geturl(params) {
//   return request({
//     url: '/systemsetting/geturl',
//     method: 'get',
//     params
//   })
// }
export function getmapcenter() {
  return request({
    url: '/Menu/central',
    method: 'get'
  })
}
// export function getLevuserTime() {
//   return request({
//     url: '/systemsetting/dislevelhp',
//     method: 'post'
//   })
// }
export function getModuleRecord(params) {
  return request({
    url: '/systemsetting/moduleClickRecord',
    method: 'get',
    params
  })
}
export function delFiles(params){
  return request({
    url:'/gridfs/delfile',
    method:'post',
    params
  })
}
// export function register(data) {
//   return request({
//     url: '/register',
//     method: 'post',
//     data,
//   })
// }
