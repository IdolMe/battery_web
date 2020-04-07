/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 00:22:40
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import {TipRed} from '../assets/image/assetsImages';
import '../styles/reFund.scss';

function ReFund() {
  const [refundData, setRefundData] = useState();
  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/recharge-item`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setRefundData(res.data.deposit)
      }
    })
  }, [])

  let history = useHistory();
  const doPay = () => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/refund-deposit`, 'POST', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        history.push(`/reFundSuccess`);
      }
    })
  }

  return (
    <div className="reFund-page">
      <Heading title='Refund Request' />
      <div className='card radius4'>
        <p className='font-14 text-center'>Deposit</p>
        <p className='font-14 text-center'>AED <span>{(refundData && refundData.amount) || 0}</span></p>
        <div className='bottom'>
          <p className='font-14 flex1'>Refund method</p>
          <div className='desc'>
            <p className='font-12'>Original card/account  </p>
            <p className='font-12 red'>(1-3 business days)</p>
            <p className='font-12 gray'>may vary upon gateway processing time.</p>
            <p className='font-12'></p>
          </div>
        </div>
      </div>
      <div className='bottom-btns'>
        <p className='font-13 red red text-center'><img src={TipRed} alt='tip' />Withdrawing your deposit would cause delay in your next use.</p>
        <p className='font-13 red text-center'>Keep your deposit in the account for a fast and easy rental experience.</p>
        <div className="btn radius4" onClick={doPay}>Refund Request</div>
      </div>
    </div>
  );
}

export default ReFund;
