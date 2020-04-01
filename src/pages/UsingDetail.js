/**
* @file: description
* @author: huguantao
* @Date: 2020-03-26 11:46:07
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 20:23:12
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';

import {GoBackWhite, UsingDetail_banner, UsingDetail_top, Tip} from '../assets/image/assetsImages';
import '../styles/usingDetail.scss';

function UsingDetail() {
  const [orderData, setOrderData] = useState({
    amount: 0,
    borrowAddress: "",
    borrowStartTime: "",
    chargingInfo: "",
    duration: 0
  });
  useEffect(() => {
    // /v1.0.0/users/status 查询最近订单使用情况
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/users/status`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        // status=OVERDRAFT   paymentdata就是未支付的订单详情
        // status=USING   usageData是使用中的详情  
        setOrderData(response.data.data.usageData);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  })

  return (
    <div className="using-detail-page">
      <div className='banner-wrap'>
        <img src={UsingDetail_banner} alt="banner" className="banner" />
        <img src={GoBackWhite} alt="back" className="back" />
      </div>
      <h3 className='fonts desc font-24'>In Use ...</h3>
      <p className='fonts title font-13'>Please return the powerbank to a nearby station after you finished.</p>
      <div className="contents">
        <div className='head'>
          <span className='font-20'>Usage</span>
          <img src={UsingDetail_top} alt="top" />
        </div>
        <div className="content">
          <div className="half-content">
            <p className="title font-13">Duration</p>
            <p className="desc font-13">{orderData.duration}</p>
          </div>
          <div className="half-content">
            <p className="title font-13">Amount</p>
            <p className="desc font-13">AED {orderData.amount}</p>
          </div>
          <div className="half-content">
            <p className="title font-13">Station</p>
            <p className="desc font-13">{orderData.borrowAddress}</p>
          </div>
          <div className="full-content">
            <p className="title font-13">Pricing</p>
            <p className="desc font-13">{orderData.chargingInfo}</p>
            {/* <p className="desc font-13">Free for 5 minutes. 1.5 AED/30 mins after, cap at 20 AED daily maximum. Up to 99 AED maximum - the powerbank is yours!</p> */}
          </div>
        </div>
      </div>


      <p className='font-13 red descs'><img src={Tip} alt='tip' />How to return a powerbank</p>
      <p className='font-13 normal descs'>1. Find a station in the app with an empty returning slot.</p>
      <p className='font-13 normal descs'>2. Plug the cables back to the powerbank and place the powerbank back to the staion with the arrow signs facing forward. A tone will ring in 3 seconds if the return is successful.</p>
      <p className='font-13 normal descs'>3. If you encountered any issue, please contact our customer service for aid.</p>
    
      <p className='bottom-service font-13 text-center'>Customer service</p>
    </div>
  );
}

export default UsingDetail;
