/**
* @file: description
* @author: huguantao
* @Date: 2020-03-27 23:51:13
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 21:51:32
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import '../styles/orderDetail.scss';

function OrderDetail(prop) {
  const orderId = prop.match.params.id || '';
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    if(orderId.length < 1) {
      Toast.show({mess:'No such order'});
    } else {
      Toast.show({type:'loading'});
      axios({
        method: 'GET',
        url: `${urlPrefix}/v1.0.0/orders/${orderId}`,
        data: {},
        headers: {
          'userToken': sessionStorage.getItem('USERTOKEN'),
          'client-platform': 'WEB'
        }
      }).then(function(response) {
        Toast.hide();
        if(response.data.httpStatusCode === 200) {
          setOrderDetail(response.data.data)
        } else {
          Toast.show({mess: response.data.error.message});
        }
      });
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
          <div className='font-14 desc'>{moment(orderDetail.borrowStartTime).format('YYYY/MM/DD hh:mm:ss')}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Station</div>
          <div className='font-14 desc'>{orderDetail.borrowStation.address}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>End time</div>
          <div className='font-14 desc'>{moment(orderDetail.returnTime).format('YYYY/MM/DD hh:mm:ss')}</div>
        </div>
        <div className='item'>
          <div className='font-14 title'>Returning station</div>
          <div className='font-14 desc'>{orderDetail.returnStation.address}</div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
