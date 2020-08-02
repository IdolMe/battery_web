/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-09 23:18:29
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Tabs } from 'antd-mobile';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import {Checked} from '../assets/image/assetsImages';
import { PullToRefresh, ListView, Button } from 'antd-mobile';
import '../styles/orderList.scss';

const DEFAULT_PAGESIZE = 10;

function OrderList() {
  let history = useHistory();
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState(new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);

  const getOrderList = async (pageNo, pageSize = 10) => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB',
    };
    const res = await request(`/v1.0.0/orders?pageIndex=${pageNo}&pageSize=${pageSize}&type=RENT`, 'GET', {}, headers);
    if (res.httpStatusCode === 200) {
      const prevData = pageNo === 1 ? [] : data;
      const nextData = [...prevData, ...res.data.list];
      setData(nextData);
      setDataSource(dataSource.cloneWithRows(nextData));
      setIsLoading(false);
      setRefreshing(false);
      setTotal(res.data.totalItems);
    }
  }

  const onEndReached = () => {
    if (isLoading || total <= pageNo * DEFAULT_PAGESIZE) {
      return;
    }
    setIsLoading(true);
    const nextPageNo = pageNo + 1;
    setPageNo(nextPageNo);
    getOrderList(nextPageNo, DEFAULT_PAGESIZE);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setPageNo(1);
    getOrderList(1, DEFAULT_PAGESIZE);
  }

  useEffect(() => {
    getOrderList(1, DEFAULT_PAGESIZE);
  }, [])

  const row = (item, sectionID, rowID) => {
    return (
      <div className='order radius4' key={rowID} onClick={()=>detail(item.orderNumber)}>
        <div className='head'>
          <span className='font-14'><img src={Checked} alt='check' />{item.borrowStatus}</span>
          <span className='font-14'>AED {item.amount}</span>
        </div>
        <div className='content font-14'>
          <p>Start time：{item.type == 'RENT' ? item.borrowStartTime : item.createTimestamp}</p>
          {item.type == 'RENT' ? <p>Station：{item.borrowStation && item.borrowStation.address}</p> : null }
          <p>Order Number：{item.orderNumber}</p>
          <div className='detail font-12 text-center'>Details</div>
        </div>
      </div>
    );
  };
  
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
      </div>

      <div className='lists'>
        {
          data && data.length ?
            <ListView
              dataSource={dataSource}
              renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading ? 'Loading...' : 'Loaded'}
              </div>)}
              renderRow={row}
              useBodyScroll={true}
              pullToRefresh={<PullToRefresh
                refreshing={refreshing}
                onRefresh={onRefresh}
                indicator={{
                  activate: null,
                  finish: null,
                  deactivate: null,
                  release: null,
                }}
              />}
              onEndReachedThreshold={30}
              onEndReached={onEndReached}
              pageSize={10}
            /> :
            <p className='font-14 title'>no order</p>
        }
        
      </div>
    </div>
  );
}

export default OrderList;
