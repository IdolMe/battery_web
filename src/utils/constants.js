/**
* @file: description
* @author: huguantao
* @Date: 2020-02-26 22:46:39
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 17:00:05
 */
let urlPrefix = "http://52.81.84.200:8094/api";
const IOSOpenUrl = "ios://";
const androidOpenUrl = "android://";

if(window.location.href.indexOf('qa') > -1 || window.location.href.indexOf('localhost') > -1) {
    urlPrefix = "https://52.81.84.200:8094/api";
}
export {
    urlPrefix,
    IOSOpenUrl,
    androidOpenUrl
};
