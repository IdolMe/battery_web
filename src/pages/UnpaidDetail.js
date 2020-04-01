/**
* @file: description
* @author: huguantao
* @Date: 2020-03-26 11:46:07
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 21:28:14
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import {PaySuccess} from '../assets/image/assetsImages';
import '../styles/unpaidDetail.scss';

function UnpaidDetail() {
  const [orderData, setOrderData] = useState({
    amount: 0,
    borrowAddress: "",
    borrowStartTime: "",
    chargingInfo: "", // 收费标准说明
    depositAmount: 0,
    duration: 0,
    orderNumber: "",
    paymentMethod: "",
    returnAddress: "",
    returnTime: "",
    terminalId: "",
    walletBalance: 0
  });
  const [visible, setVisible] = useState(false);

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
        setOrderData(response.data.data.paymentData)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  })

  let history = useHistory();
  const doPay = () => {
    setVisible(true)
    setTimeout(() => {
      setVisible(false)
      // history.push(`/home`);
    }, 1500)
  }

  return (
    <div className="unpaid-detail-page">
      <div className='heading-wrap'>
        <Heading title='Order Details' />
        <p className='font-14 status'>Unpaid Order</p>
        <p className='amount'>
          <span className='desc font-14'>AED</span>
          <span className='num'>{orderData.amount}</span>
        </p>
      </div>

      <div className="items items1">
        <div className='item'>
          <div className='font-14 title'>Pricing</div>
          <div className='font-14 desc'>
            <p>{orderData.chargingInfo}</p>
            {/* <p>Free for 5 minutes. </p>
            <p>1.5 AED/30 mins after, cap at 20 AED daily maximum.</p>
            <p>Up to 99 AED rental maximum - the powerbank is yours!</p> */}
          </div>
        </div>
      </div>
      
      <div className="items">
        <div className='item'>
          <div className='font-14 title'>Duration</div>
          <div className='font-14 desc'>{orderData.duration}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Payment method</div>
          <div className='font-14 desc'>{orderData.paymentMethod}</div>
        </div>
      </div>

      <div className="items items-last">
        <div className='item'>
          <div className='font-14 title'>Order Number</div>
          <div className='font-14 desc'>{orderData.orderNumber}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Powerbank ID</div>
          <div className='font-14 desc'>{orderData.terminalId}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Start time</div>
          <div className='font-14 desc'>{orderData.borrowStartTime}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Station</div>
          <div className='font-14 desc'>{orderData.borrowAddress}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>End time</div>
          <div className='font-14 desc'>{orderData.returnTime}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Returning station</div>
          <div className='font-14 desc'>{orderData.returnAddress}</div>
        </div>
      </div>

      <div className='btn' onClick={doPay}>Pay</div>

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

export default UnpaidDetail;
