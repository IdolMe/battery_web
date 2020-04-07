/**
* @file: 在取了充电宝很快还了，或者超时没拿充电宝触发
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 00:23:29
 */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import '../styles/paySuccess.scss';

function PaySuccess() {
  let history = useHistory();
  const goHome = () => {
    history.push(`/home`);
  }
  const goDetail = (id) => {
    history.push(`/order/${id}`);
  }

  return (
    <div className="pay-success-page">
      <div className='card radius4'>
        <Heading />
        <h3 className='font-24 padding'>Success</h3>
        <div className='items font-13 padding'>
          <p className='flex'><span>Amount</span><span>AED 0</span></p>
          <p className='flex'><span>Duration</span><span>0 day 0 hour 2 minutes</span></p>
          <p className='flex'><span>Payment method</span><span>Account Balance</span></p>
          <p className='flex'><span>Account Balance</span><span>AED 0</span></p>
          <p className='flex'><span>Deposit</span><span>AED 0</span></p>
        </div>
        <div className='btns font-18 padding flex'>
          <div className='btn radius4 text-center'  onClick={goDetail}>Order Details</div>
          <div className='btn radius4 text-center green' onClick={goHome}>Back to home</div>
        </div>
      </div>
    </div>
  );
}

export default PaySuccess;
