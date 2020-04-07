/**
* @file: description
* @author: huguantao
* @Date: 2020-03-26 11:46:07
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 00:13:09
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import Toast from '../components/Toast/Toast';
import Heading from '../components/Heading';
import {request} from '../utils/request';
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
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/status`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        // status=OVERDRAFT   paymentdata就是未支付的订单详情
        // status=USING   usageData是使用中的详情  
        setOrderData(res.data.paymentData)
      }
    })

  }, []);

  let history = useHistory();
  const doPay = () => {
    const reqData = {
      orderNumber: orderData.orderNumber,
      type: "OVERDUE"
    };
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/payments/payby`, 'POST', reqData, headers ).then(resp=> {
      if(resp.httpStatusCode === 200) {
        const resData = resp.data;
        window.ToPayJSBridge.invoke(
          'ToPayRequest',
          {
            appId: resData.appId, // partnerId 
            token: resData.token // For order token, refer to the token in interactionParams returned from the transaction creation interface
          },
          function(data) {
            const res = JSON.parse(data)
            if (res.status === 'success') {
              // 支付成功之后停留五秒等待结果同步，然后展示成功并跳转
              Toast.show({type:'loading'});
              setTimeout(() => {
                Toast.hide();
                setVisible(true)
                setTimeout(() => {
                  setVisible(false);
                  // 付完去首页
                  history.push(`/home`);
                }, 1500)
              }, 3500);

            } else {
              Toast.show({mess: 'pay failed, please try again'});
            }
          }
        )
      }
    })
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
            <p>{orderData.chargingInfo && orderData.chargingInfo.title}</p>
            <p>{orderData.chargingInfo && orderData.chargingInfo.description}</p>
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
