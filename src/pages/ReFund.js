/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-03 23:40:40
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import {TipRed} from '../assets/image/assetsImages';
import '../styles/reFund.scss';

function ReFund() {
  const [refundData, setRefundData] = useState();
  useEffect(() => {
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/users/recharge-item`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setRefundData(response.data.data.deposit)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])

  let history = useHistory();
  const doPay = () => {
    Toast.show({type:'loading'});
    axios({
      method: 'POST',
      url: `${urlPrefix}/v1.0.0/users/refund-deposit`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        Toast.hide();
        history.push(`/reFundSuccess`);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
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
