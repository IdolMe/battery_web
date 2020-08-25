/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 23:13:00
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd-mobile';
import Toast from '../components/Toast/Toast';
import Heading from '../components/Heading';
import { request } from '../utils/request';
import { getQueryString } from '../utils/helper';
import { Payment, Checked, Tip, PaySuccess } from '../assets/image/assetsImages';
import '../styles/payDeposit.scss';

function PayDeposit() {
  const [visible, setVisible] = useState(false);
  const [rechargeData, setRechargeData] = useState();

  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/recharge-item`, 'GET', {}, headers,false, true).then(res => {
      if (res.httpStatusCode === 200) {
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
      request(`/v1.0.0/orders/${orderId}`, 'GET', {}, headers,true).then(res => {
        if (res.httpStatusCode === 200) {
          initalTime++;
          if (res.data.paymentStatus === 'PAID') {
            // 付完押金去往租借页面
            const from = getQueryString('from')
            if (from === 'wallet') {
              history.push(`/wallet`);
              return;
            }
            if (sessionStorage.getItem('BOXID')) {
              history.push(`/rentProcess/paid`);
              return;
            }
            history.push(`/home`);
            return;
          }

          if (initalTime >= time) {
            Toast.show({ mess: 'Payment failed. Please try again later.' });
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
    request(`/v1.0.0/payments/payby`, 'POST', reqData, headers).then(resp => {
      if (resp.httpStatusCode === 200) {

        const resData = resp.data;

        window.ToPayJSBridge.invoke(
          'ToPayRequest',
          {
            appId: resData.appId, // partnerId 
            token: resData.token // For order token, refer to the token in interactionParams returned from the transaction creation interface
          },
          function (data) {
            data = JSON.parse(data)
            if (data.status === 'failed') {
              Toast.show({ mess: 'Payment failed. Please try again later.' });
              return;
            }
            Toast.show({ type: 'loading' });
            retry(resData.orderNumber, 5, 800);
            Toast.hide();
            Toast.show({ mess: 'Payment failed. Please try again later.' });
            return;
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
      <p className='font-13 red descs'><img src={Tip} alt='tip' />How to refund the deposit?</p>
      <p className='font-13 normal descs'>How to refund the deposit? In Payby> power bank> account> wallet> click deposit, you can refund to Payby account</p>
      <div className="btn radius4" onClick={doPay}>Pay Deposit</div>

      <Modal
        title=""
        visible={visible}
        closable={false}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
        destroyOnClose={true}
        onCancel={() => { setVisible(false) }}
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
