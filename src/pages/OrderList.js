/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 21:15:52
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs } from 'antd';
import axios from 'axios';
import moment from 'moment';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';

import {Checked} from '../assets/image/assetsImages';
import '../styles/orderList.scss';

function OrderList() {
  let history = useHistory();
  const [orders, setOrders] = useState({});

  useEffect(() => {
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/orders`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB',
        'pageIndex': 1,   // 从1开始
        'pageSize': 999,
        'type': 'RENT'  // DEPOSIT RENT TOPUP
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setOrders(response.data.data)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])
  
  const { TabPane } = Tabs;
  const callback = (key) => {
    console.log(key);
  }

  const detail = (id) => {
    history.push(`/orderDetail/${id}`);
  }

  return (
    <div className="order-list-page">
      <div className='header-wrap'>
        <Heading title='Orders' />
        <div className='navs-wrap'>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Powerbank" key="1" className='tab-bars'>
              {/* Content of Tab Pane 1 */}
            </TabPane>
            {/* <TabPane tab="座充" key="2"></TabPane>
            <TabPane tab="购买充电宝" key="3"></TabPane> */}
          </Tabs>
        </div>
      </div>

      <div className='lists'>
        {
          orders.list && orders.list.map((item, index) => {
            return <div className='order radius4'>
              <div className='head'>
                <span className='font-14'><img src={Checked} alt='check' />{item.borrowStatus}</span>
                <span className='font-14'>AED {item.amount}</span>
              </div>
              <div className='content font-14'>
                <p>Start time：{moment(item.borrowStartTime).format('YYYY/MM/DD hh:mm:ss')}</p>
                <p>Station：{item.borrowAddress}</p>
                <p>Order Number：{item.orderNumber}</p>
                <div className='detail font-12 text-center' onClick={()=>detail(item.orderNumber)}>Details</div>
              </div>
            </div>
          })
        }

        {/* 这个是例子 */}
        <div className='order radius4'>
          <div className='head'>
            <span className='font-14'><img src={Checked} alt='check' />Finished</span>
            <span className='font-14'>AED 0</span>
          </div>
          <div className='content font-14'>
            <p>Start time：{moment('2020-04-01T12:47:54.758Z').format('YYYY/MM/DD hh:mm:ss')}</p>
            <p>Station：Address</p>
            <p>Order Number：40200318270552</p>
            <div className='detail font-12 text-center' onClick={()=>detail(1)}>Details</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default OrderList;
