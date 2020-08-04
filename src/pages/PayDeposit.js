/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 23:13:00
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd-mobile';
import Toast from '../components/Toast/Toast';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import {getQueryString} from '../utils/helper';
import {Payment, Checked, Tip, PaySuccess} from '../assets/image/assetsImages';
import '../styles/payDeposit.scss';

function PayDeposit() {
  const [visible, setVisible] = useState(false);
  const [rechargeData, setRechargeData] = useState();

  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/recharge-item`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setRechargeData(res.data.deposit);
      }
    })
  }, [])

  let history = useHistory();

  const retry = (orderId, time, interval) => {
    let initalTime = 0;
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    const fn = () => {
      request(`/v1.0.0/orders/${orderId}`, 'GET', {}, headers).then(res=> {
        if(res.httpStatusCode === 200) {
          initalTime++;
          if (res.data.paymentStatus === 'PAID') {
            Toast.show({type:'loading'});
            setTimeout(() => {
              Toast.hide();
              setVisible(true)
              setTimeout(() => {
                setVisible(false);
                // 付完押金去往租借页面
                const from = getQueryString('from')
                if (from === 'wallet') {
                  history.push(`/wallet`);
                  return;
                }
                if(sessionStorage.getItem('BOXID')) {
                  history.push(`/rentProcess/paid`);
                  return;
                } 

                history.push(`/home`);
              }, 1500)
            }, 3500);
            return;
          }
          
          if (initalTime >= time) {
            Toast.show({mess: 'Payment failed. Please try again later.'});
            return;
          }
          setTimeout(() => {
            fn();
          }, interval)
        }
      })
    }
    fn();
  }

  const doPay = () => {
    const reqData = {
      rechargeItemId: rechargeData.id,
      type: "DEPOSIT"
    };
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/payments/payby`, 'POST', reqData, headers ).then(resp=> {
      if(resp.httpStatusCode === 200) {
        
        const resData = resp.data;

        window.ToPayJSBridge.invoke(
          'ToPayRequest',
          {
            appId: resData.appId, // partnerId 
            token: resData.token // For order token, refer to the token in interactionParams returned from the transaction creation interface
          },
          function(data) {
            if (data === 'success') {
              // 支付成功之后停留五秒等待结果同步，然后展示成功并跳转
              Toast.show({type:'loading'});
              setTimeout(() => {
                Toast.hide();
                setVisible(true)
                setTimeout(() => {
                  setVisible(false);
                  // 付完押金去往租借页面
                  const from = getQueryString('from')
                  if (from === 'wallet') {
                    history.push(`/wallet`);
                    return;
                  }
                  if(sessionStorage.getItem('BOXID')) {
                    history.push(`/rentProcess/paid`);
                    return;
                  } 

                  history.push(`/home`);
                }, 1500)
              }, 1500);
              return;
            }

            if (data === 'paying') {
              retry(resData.orderNumber, 2, 300);
              return;
            }
            
            Toast.show({mess: 'Payment failed. Please try again later.'});
          }
        )

      }
    })
  }

  return (
    <div className="payDeposit-page">
      <Heading />
      <div className='card radius4'>
        <p className='font-14 text-center'>You need to pay for the deposit before renting a powerbank.</p>
        <p className='font-14 text-center'>AED <span>{rechargeData && rechargeData.amount}</span></p>
        <div className='bottom'>
          <p className='font-14'><img src={Payment} alt='pay' /> PayBy</p>
          <img src={Checked} alt='checked' />
        </div>
      </div>
      <p className='font-13 red descs'><img src={Tip} alt='tip' />How to get back your deposit</p>
      <p className='font-13 normal descs'>Please call our customer support to request a refund for your deposit</p>
      <div className="btn radius4" onClick={doPay}>Pay a deposit</div>

      <Modal
        title=""
        visible={visible}
        closable={false}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
        destroyOnClose={true}
        onCancel={()=> {setVisible(false)}}
      >
        <div id="home-modal" className="text-center">
          <img src={PaySuccess} alt="tip-img" className="topImg" />
          <h4 className="font-16">Success</h4>
        </div>
      </Modal>
    </div>
  );
}

export default PayDeposit;
