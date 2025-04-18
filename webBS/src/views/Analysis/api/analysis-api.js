import request from '@/utils/request';

//事件类型（图层接口）
export function getMattersinTypes() {
    return request({
      url: '/snapshot/mattersintypes',
      method: 'get',
    })
  }
