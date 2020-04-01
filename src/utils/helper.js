/**
* @file: description
* @author: huguantao
* @Date: 2020-02-04 15:05:53
* @LastEditors: huguantao
* @LastEditTime: 2020-03-31 23:47:37
 */
export function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

export function getLocationSearch() {
    let url = window.location.search; //获取url中"?"符后的字串
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


export function isEmpty(obj) {
    for (let name in obj) {
        return false;
    }
    return true;
}

export function getUA () {
    let userAgent = navigator.userAgent || '';
    if (/android/i.test(userAgent)) {
        return 'android';
    } else if (/ios/i.test(userAgent)) {
        return 'ios';
    }
    return 'h5';
}

