export function getcookie(name){
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return (unescape(arr[2]) );
    else
      return null;
};

export function setcookie(name,value,expiredays){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
};

export function delcookie(name){
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
     document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

export function getCookieFields(name, fieldname) {
    var value = getcookie(name);
    if (fieldname != "" && fieldname != null && fieldname != undefined && fieldname != "undefined") {
        if (value != null) {
            var cookies = value.split("&");
            if (cookies.length > 0) {
                for (var i = 0; i < cookies.length; i++) {
                    var cookiestr = cookies[i].split("=");
                    if (fieldname == cookiestr[0]) {
                        return cookiestr[1];
                    }
                }
            }
        }
    }
    return value;
};