/**
* @file: 在取了充电宝很快还了，或者超时没拿充电宝触发
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-22 21:51:47
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { request } from '../utils/request';
import Heading from '../components/Heading';
import '../styles/paySuccess.scss';

function PaySuccess() {
  const [orderDetail, setOrderDetail] = useState({});
  let history = useHistory();

  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/status`, 'GET', {}, headers).then(res => {
      if (res.httpStatusCode === 200) {
        setOrderDetail(res.data.paymentData)
      }
    })
  }, []);

  const goHome = () => {
    history.push(`/home`);
  }
  const goDetail = () => {
    history.push(`/orderDetail/${orderDetail.orderNumber}`);
  }

  return (
    <div className="pay-success-page">
      <div className='card radius4'>
        <Heading goto='/home' />
        <h3 className='font-24 padding'>Success</h3>
        <div className='items font-13 padding'>
          <p className='flex'><span>Amount</span><span>AED {orderDetail.amount}</span></p>
          <p className='flex'><span>Duration</span><span>{orderDetail.duration}</span></p>
          <p className='flex'><span>Payment method</span><span>{orderDetail.paymentMethod}</span></p>
          <p className='flex'><span>Account Balance</span><span>AED {orderDetail.walletBalance}</span></p>
          <p className='flex'><span>Deposit</span><span>AED {orderDetail.depositAmount}</span></p>
        </div>
        <div className='btns font-18 padding flex'>
          <div className='btn radius4 text-center' onClick={goDetail}>Order Details</div>
          <div className='btn radius4 text-center green' onClick={goHome}>Back to home</div>
        </div>
      </div>
    </div>
  );
}

export default PaySuccess;
