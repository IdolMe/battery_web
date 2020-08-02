/**
* @file: description
* @author: huguantao
* @Date: 2020-02-26 22:46:39
* @LastEditors: huguantao
* @LastEditTime: 2020-04-13 20:20:01
 */
let urlPrefix = `http://${process.env.NODE_ENV === 'production' ? 'test' : 'dev'}.powerbank.zodme.com/api`;
const IOSOpenUrl = "ios://";
const androidOpenUrl = "android://";

if(window.location.href.indexOf('qa') > -1 || window.location.href.indexOf('localhost') > -1) {
    urlPrefix = `http://${process.env.NODE_ENV === 'production' ? 'test' : 'dev'}.powerbank.zodme.com/api`;
}
export {
    urlPrefix,
    IOSOpenUrl,
    androidOpenUrl
};
