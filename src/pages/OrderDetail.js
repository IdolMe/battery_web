/**
* @file: description
* @author: huguantao
* @Date: 2020-03-27 23:51:13
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 23:23:31
 */
import React, {useState, useEffect} from 'react';
import Toast from '../components/Toast/Toast';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import '../styles/orderDetail.scss';

function OrderDetail(prop) {
  const orderId = prop.match.params.id || '';
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    if(orderId.length < 1) {
      Toast.show({mess:'No such order'});
    } else {
      const headers = {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      };
      request(`/v1.0.0/orders/${orderId}`, 'GET', {}, headers ).then(res=> {
        if(res.httpStatusCode === 200) {
          setOrderDetail(res.data)
        }
      })
    }
  }, [])

  return (
    <div className="order-detail-page">
      <div className='heading-wrap'>
        <Heading title='Order Details' />
        <p className='font-14 status'>{orderDetail.borrowStatus} Order</p>
        <p className='amount'>
          <span className='desc font-14'>AED</span>
          <span className='num'>{orderDetail.amount}</span>
        </p>
      </div>

      <div className="items items1">
        <div className='item'>
          <div className='font-14 title'>Pricing</div>
          <div className='font-14 desc'>
            <p>{orderDetail.chargingInfo && orderDetail.chargingInfo.title}</p>
            <p>{orderDetail.chargingInfo && orderDetail.chargingInfo.description}</p>
          </div>
        </div>
      </div>
      
      <div className="items">
        <div className='item'>
          <div className='font-14 title'>Duration</div>
          <div className='font-14 desc'>{orderDetail.duration} min</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Payment method</div>
          <div className='font-14 desc'>{orderDetail.paymentMethod}</div>
        </div>
      </div>

      <div className="items">
        <div className='item'>
          <div className='font-14 title'>Order Number</div>
          <div className='font-14 desc'>{orderDetail.orderNumber}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Powerbank ID</div>
          <div className='font-14 desc'>{orderDetail.terminalId}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Start time</div>
          <div className='font-14 desc'>{orderDetail.borrowStartTime}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Station</div>
          <div className='font-14 desc'>{orderDetail.borrowStation && orderDetail.borrowStation.address}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>End time</div>
          <div className='font-14 desc'>{orderDetail.returnTime}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Returning station</div>
          <div className='font-14 desc'>{orderDetail.borrowStation && orderDetail.returnStation.address}</div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
