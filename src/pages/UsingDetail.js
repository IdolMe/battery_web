/**
* @file: description
* @author: huguantao
* @Date: 2020-03-26 11:46:07
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:14:38
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {request} from '../utils/request';
import {GoBackWhite, UsingDetail_banner, UsingDetail_top, Tip} from '../assets/image/assetsImages';
import '../styles/usingDetail.scss';

let startTime = null;

function UsingDetail() {
  const [orderData, setOrderData] = useState({
    amount: 0,
    borrowAddress: "",
    borrowStartTime: "",
    chargingInfo: "",
    duration: 0
  });

  useEffect(() => {
    window.addEventListener("popstate", function(){
      history.push('/home');
  }, false);
    checkStatus();
    const intervalCheck = setInterval(() => {
      // 5秒查一次状态，跳转
      checkStatus();
    }, 3000);

    // 监听touch事件，下拉刷新
    let parent = document.querySelector('.touch-zone');
    parent.addEventListener('touchstart', touchStart);
    parent.addEventListener('touchend', touchEnd);

    return ()=> {
      clearInterval(intervalCheck);
      parent.removeEventListener('touchstart', touchStart);
      parent.removeEventListener('touchend', touchEnd);
    }
  }, []);

  const touchStart = () => {
    startTime = new Date().getTime();
  }
  const touchEnd = () => {
    // 页面刷到顶且touch超过500ms 刷新
    if(isTop() && (new Date().getTime() - startTime > 500)){
      checkStatus();
    }
    return;
  }

  const checkStatus = () => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    }
    request(`/v1.0.0/users/status`, 'GET', {}, headers,true ).then(res=> {
      if(res.httpStatusCode === 200) {
        // status=OVERDRAFT   paymentdata就是未支付的订单详情
        // status=USING   usageData是使用中的详情  
        
        switch(res.data.status) {
          case 'OVERDRAFT':
            // 已完成未支付
            history.push('/unpaidDetail');
            break;
          case 'FINISH': 
            // history.push(`/orderDetail/${res.data.paymentData.orderNumber}`);
            history.push(`/paySuccess`);
            break;
          case 'OVERDUE_SETTLEMENT':
            history.push(`/payDeposit`);
            break;
          case 'NONE':
            history.push('/home');
            break;
          default: 
            setOrderData(res.data.usageData);
        }
      }
    })
  }

  const isTop = () => {
    var t = document.documentElement.scrollTop||document.body.scrollTop;
    return t === 0 ? true : false;
  }

  let history = useHistory();
  const goback = () => {
    history.push('/home');
  }

  return (
    <div className="using-detail-page">
      <div className='banner-wrap'>
        <img src={UsingDetail_banner} alt="banner" className="banner" />
        <img src={GoBackWhite} alt="back" className="back" onClick={goback} />
      </div>
      <div className='touch-zone'>
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
              <p className="desc font-13">{orderData.borrowStation && orderData.borrowStation.address}</p>
            </div>
            <div className="full-content">
              <p className="title font-13">Pricing</p>
              <p className="desc font-13">{orderData.chargingInfo && orderData.chargingInfo.title}</p>
              <p className="desc font-13">{orderData.chargingInfo && orderData.chargingInfo.description}</p>
            </div>
          </div>
        </div>

        <p className='font-13 red descs'><img src={Tip} alt='tip' />How to return a powerbank</p>
        <p className='font-13 normal descs'>1. Find a station with an empty returning slot.</p>
        <p className='font-13 normal descs'>2. Plug the cables back to the powerbank and place the powerbank back to the station with the arrow signs facing forward. A tone will ring in 3 seconds if the return is successful.</p>
        <p className='font-13 normal descs'>3. If you encountered any issue, please contact our customer service for aid.</p>
      
        <p className='bottom-service font-13 text-center' onClick={() => {
          window.location.href = 'https://m.payby.com/platform/payby/customerService';
        }}>Customer service</p>
      </div>
    </div>
  );
}

export default UsingDetail;

