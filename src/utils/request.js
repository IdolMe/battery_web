/**
* @file: description
* @author: huguantao
* @Date: 2020-02-04 15:05:53
* @LastEditors: huguantao
* @LastEditTime: 2020-04-10 22:19:08
 */
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import {urlPrefix} from '../utils/constants';

export function request(url, method, data={}, headers={}, noHide=false) {
    !noHide && Toast.show({type:'loading'});
    return new Promise((resolve,reject)=>{
        axios({
            method: method,
            url: urlPrefix + url,
            data: data,
            headers: headers
        }).then(res=> {
            Toast.hide();
            resolve(res.data);
        }).catch(error=> {
            Toast.hide();
            // 错误处理 http://www.axios-js.com/zh-cn/docs/#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86
            if (error.response) {
                Toast.show({mess: error.response.data.error.message || 'something went wrong, please try again later'});
                console.log(error.response.data);
            }
            console.log(error)
        })
    });
}
