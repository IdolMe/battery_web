/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-03 22:53:20
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Select } from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import {getQueryString} from '../utils/helper';
import {Logo, LoginGoDown} from '../assets/image/assetsImages';
import '../styles/login.scss';

const { Option } = Select;
// 四个测试账户， 分别为 未付押金 正在使用充电宝 已归还未支付 超时未归还扣押金
const accounts = ['+971 56 *** 8881', '+971 56 *** 8882', '+971 56 *** 8886', '+971 56 *** 8888'];
const statusTokens = ['token_unDeposited', 'token_in_use', 'token_unpaid_order', 'token_overDue'];


function Login() {
  // 入口带过来机器码 boxId
  const BOXID = getQueryString('boxID') || 'RL3H042003250001';  // 机柜id，APP会带过来
  const [USERTOKEN, setUSERTOKEN] = useState('');
  // const [USERTOKEN, setUSERTOKEN] = useState(statusTokens[0]);   // TODO 从bridge取得用户token

  sessionStorage.setItem('BOXID', BOXID);

  function onChange(value) {
    // 根据选择的账号给不同的测试token
    // if(value.indexOf('8882' > 0)) {
    //   setUSERTOKEN(statusTokens[1])
    // } else if(value.indexOf('8886' > 0)) {
    //   setUSERTOKEN(statusTokens[2])
    // } else if(value.indexOf('8888' > 0)) {
    //   setUSERTOKEN(statusTokens[3])
    // } else {
    //   setUSERTOKEN(statusTokens[0])
    // }
    // sessionStorage.setItem('USERTOKEN', USERTOKEN);
  }

  let history = useHistory();

  const doLogin = () => {
    Toast.show({type:'loading'});
    // APP的token鉴权换token登录方式
    // axios({
    //   method: 'POST',
    //   url: `${urlPrefix}/v1.0.0/authz`,
    //   data: {},
    //   headers: {
    //     'authToken': getQueryString('access_token') || 'T3mkVFb1PhMVqGS7QfpiQg',
    //     'client-platform': 'WEB',
    //   }
    // }).then(function(response) {
    //   Toast.hide();
    //   if(response.data.httpStatusCode === 200) {
    //     setUSERTOKEN(response.data.data.token);
    //     sessionStorage.setItem('USERTOKEN', response.data.data.token);
    //     history.push(`/home`);
    //   } else {
    //     debugger
    //     Toast.show({mess: response.data.error.message});
    //   }
    // });

    // 手机号验证码登录方式
    axios({
      method: 'POST',
      url: `${urlPrefix}/v1.0.0/login`,
      data: {
        cellphone: "13344445555",
        smsCode: "1234"
      },
      headers: {
        'client-platform': 'WEB',
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setUSERTOKEN(response.data.data.token);
        sessionStorage.setItem('USERTOKEN', response.data.data.token);
        history.push(`/home`);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }

  return (
    <div className="login-page">
      <img src={Logo} alt="logo" className="logo" />
      <div className="login-accounts">
        <Select
          defaultValue={accounts[0]}
          onChange={onChange}
          className='login-select'
          suffixIcon={Icon()}
          autoFocus={true}
        >
          {
            accounts.map((item, index) => {
              return <Option value={item} key={index}>{item}</Option>
            })
          }
        </Select>
      </div>
      <div></div>
      <div className="login-btn radius4" onClick={doLogin}>Login</div>
      <p className="version">V1.0.0</p>
    </div>
  );
}

export default Login;

function Icon() {
  return <img src={LoginGoDown} className='login-select-icon' alt='icon'></img>
}
