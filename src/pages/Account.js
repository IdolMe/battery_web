/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:54:19
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import {AccountOrder, AccountHead, AccountWallet, AccountMessage, AccountMark, AccountEdit} from '../assets/image/assetsImages';
import '../styles/account.scss';

function Account() {
  let history = useHistory();
  const [userInfo, setUserInfo] = useState({
    account: "",
    balance: 0,
    cellphone: "",
    hasDeposit: false,
    nickname: "",
    profilePictureUrl: AccountHead
  });

  useEffect(() => {
    const headers = {
      'userToken': '1405c7746ab5e44af90ee497b9d9f7d3efdb07f7a9790b4b0f7d7df722325223',
      'client-platform': 'WEB',
    };
    request(`/v1.0.0/login`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setUserInfo(res.data)
      }
    })
  }, [])

  const gotoPath = (path) => {
    if(path == 'service') {
      // window.location.href = "tel://10086";
      history.push('/customerService')
    } else {
      history.push(`/${path}`);
    }
  }

  return (
    <div className="account-page">
      <div className='header-wrap'>
        <Heading title='Account' />
        <div className='headCard margin-auto font-fff'>
          <div className='info'>
            <img src={userInfo.profilePictureUrl || AccountHead} className='head' alt='head' />
            <p className='font-18'>{userInfo.nickname || 'unnamed'}</p>
            <p className='font-14'>ID:{userInfo.account}</p>
          </div>
        </div>
      </div>
      
      <div className="contents">
        <div className='items items1 margin-auto'>
          <div className='item' onClick={()=>{gotoPath('orderList')}}>
            <img src={AccountOrder} alt='order' />
            <span className='font-14'>Orders</span>
          </div>
          <div className='item mid' onClick={()=>{gotoPath('wallet')}}>
            <img src={AccountWallet} alt='wallet' />
            <span className='font-14'>Wallet</span>
          </div>
          <div className='item' onClick={()=>{gotoPath('message')}}>
            <img src={AccountMessage} alt='message' />
            <span className='font-14'>Message</span>
          </div>
        </div>

        <div className='items'>
          <div className='item' />
          <div className='item mid' />
          <div className='item' />
        </div>
      </div>

      <div className='bottom'>
        <div 
          className="login-btn radius4 font-fff font-18 text-center margin-auto" 
          onClick={()=>{gotoPath('service')}}>Customer Service</div>
        <p className="version font-16 text-center">V1.0.0</p>
      </div>
    </div>
  );
}

export default Account;
