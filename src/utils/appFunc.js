/**
* @file: description
* @author: huguantao
* @Date: 2020-04-04 17:55:43
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 21:42:07
 */
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from './constants';
import VConsole from 'vconsole';

let checkCount = 0;
let vConsole = new VConsole();

export function payBy(appId, token, orderNumber) {
  Toast.show({type:'loading'});

  checkCount = 0
  if (typeof window.ToPayJSBridge === 'undefined') {
    console.log('payBy函数内部');
    const result = invokeBridge(appId, token, orderNumber);
    return result;
  } else {
    // If there is no PayByJSBridge in the environment, statements in "else" are executed
    setTimeout(() => {
      console.log('延时payBy函数内部');
      const result = invokeBridge(appId, token, orderNumber);
      console.log('延时payBy函数内部result:',result)
      return result;
    }, 2000);
  }
}

function invokeBridge(appId, token, orderNumber) {
  window.ToPayJSBridge.invoke(
    'PayByRequest',
    {
      appId: appId, // partnerId 
      token: token // For order token, refer to the token in interactionParams returned from the transaction creation interface
    },
    function(res) {
      alert(JSON.stringify(res))
      if (res.status === 'success') {
        // After user’s successful payment, it returns res.status === "success" and executes the callback method
        console.log('invokeBridge函数成功了')
        const result = checkResult(orderNumber);
        return result;
      } else {
        console.log('invokeBridge函数失败了')
      }
    }
  )
}

function checkResult (orderNumber) {
  Toast.show({type:'loading'});
  axios({
    method: 'GET',
    url: `${urlPrefix}/v1.0.0/orders/${orderNumber}`,
    data: {},
    headers: {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    }
  }).then(function(response) {
    Toast.hide();
    if(response.data.httpStatusCode === 200) {
      if(response.data.data.paymentStatus == 'PAID') {
        Toast.hide();
        checkCount = 0;
        console.log('checkResult拿到支付结果')
        return true;
      } else if(checkCount > 3) {
        console.log('checkResult三次没拿到')
        Toast.hide();
        checkCount = 0;
        return false;
      } else {
        setTimeout(() => {
          console.log('checkResult没拿到，重试')
          checkResult(orderNumber);
          checkCount++;
        }, 2500);
      }
    } else {
      Toast.show({mess: response.data.error.message});
    }
  });
}