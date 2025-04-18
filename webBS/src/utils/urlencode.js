/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/5/13 16:30:26
 * @LastEditors: 12390
 * @LastEditTime: 2022/5/13 16:30:26
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
const urlEncode = {
  //加密
  encode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
  },
  //解密
  decode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
export default urlEncode
