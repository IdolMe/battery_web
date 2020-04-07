/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-07 23:47:50
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {request} from '../utils/request';
import Heading from '../components/Heading';
import {Expand, WalletIcon1, WalletIcon2} from '../assets/image/assetsImages';
import '../styles/wallet.scss';

function Wallet() {
  let history = useHistory();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB',
    }
    request(`/v1.0.0/login`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setUserInfo(res.data)
      }
    })
  }, [])
  
  const deposit = () => {
    if(userInfo.hasDeposit) {
      history.push(`/reFund`);
    } else {
      history.push(`/payDeposit`);
    }
  }

  const transaction = () => {
    history.push(`/transactions`);
  }

  const topup = () => {
    history.push(`/topup`);
  }

  return (
    <div className="wallet-page">
      <div className='header-wrap'>
        <Heading title='Wallet' />
      </div>

      <div className='card radius4 text-center font-fff'>
        <div className='top font-14'>
          <p>Account Balance</p>
          <p>AED <span>{userInfo.balance}</span></p>
        </div>
        <div className='btn font-18 radius4' onClick={topup}>Top-up</div>
      </div>

      <div className='list radius4 font-14' onClick={deposit}>
        <p><img src={WalletIcon1} alt='icon'/>Deposit</p>
        <p className='red'>{ userInfo.hasDeposit ? '' : 'Deposit Unpaid'}<img src={Expand} className='expand' alt='expand'></img></p>
      </div>
      <div className='list radius4 font-14' onClick={transaction}>
        <p><img src={WalletIcon2} alt='icon'/>Transactions</p>
        <p><img src={Expand} className='expand' alt='expand'></img></p>
      </div>
      
    </div>
  );
}

export default Wallet;
