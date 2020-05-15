/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:11:43
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {getQueryString} from '../utils/helper';
import {request} from '../utils/request';
import {Loading} from '../assets/image/assetsImages';

const style = {
  display: 'block',
  margin: '35% auto 0',
  width: '50%'
}

function LoadingPage() {
  let history = useHistory();
  const access_token = getQueryString('access_token'); // 用户token，APP会带过来 QUAqLHmzSDm6UYM6m1thx8

  // const access_token = 'QUAqLHmzSDm6UYM6m1thx8';
  // APP的token鉴权换token登录方式
  useEffect(() => {
    const headers = {
      'access_token': access_token,
      'client-platform': 'WEB',
    };
    request(`/v1.0.0/authz`, 'POST', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        sessionStorage.setItem('USERTOKEN', res.data.token);
        history.push(`/home`);
      }
    })
  })

  return (
    <div className="loading-page">
      <Heading type='exit' />
      <img src={Loading} alt='logo' style={style} />
    </div>
  );
}

export default LoadingPage;
