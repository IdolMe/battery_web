/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 17:46:14
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import {Payment, Checked, Tip, PaySuccess} from '../assets/image/assetsImages';
import '../styles/payDeposit.scss';

function PayDeposit() {
  const [visible, setVisible] = useState(true);
  const [rechargeData, setRechargeData] = useState();

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
        setRechargeData(response.data.data.deposit);
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
      url: `${urlPrefix}/v1.0.0/payments/payby`,
      data: {
        rechargeItemId: rechargeData.id,
        type: "DEPOSIT"
      },
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setVisible(true)
        setTimeout(() => {
          setVisible(false);
          // 付完押金去往租借页面
          history.push(`/rentProcess/paid`);
        }, 800)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }

  return (
    <div className="payDeposit-page">
      <Heading />
      <div className='card radius4'>
        <p className='font-14 text-center'>You need to pay for the deposit before renting a powerbank.</p>
        <p className='font-14 text-center'>AED <span>{rechargeData && rechargeData.amount}</span></p>
        <div className='bottom'>
          <p className='font-14'><img src={Payment} alt='pay' /> Wechat</p>
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
