/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-09 23:22:54
 */
import React, {useState, useEffect} from 'react';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import '../styles/transactions.scss';
import { PullToRefresh, ListView, Button } from 'antd-mobile';

const DEFAULT_PAGESIZE = 10;

function Transactions() {
  const [filterType, setFilterType] = useState("ALL");
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState(new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);

  const getTransactionList = async (pageNo, pageSize = 10, filterType) => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB',
    };
    const res = await request(`/v1.0.0/users/transations?pageIndex=${pageNo}&pageSize=${pageSize}&queryType=${filterType}`, 'GET', {}, headers);
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
    getTransactionList(nextPageNo, DEFAULT_PAGESIZE, filterType);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setPageNo(1);
    setFilterType('ALL');
    getTransactionList(1, DEFAULT_PAGESIZE, 'ALL');
  }

  useEffect(() => {
    getTransactionList(1, DEFAULT_PAGESIZE, filterType);
  }, [])

  const filter = (type) => {
    setFilterType(type);
    setPageNo(1);
    getTransactionList(1, DEFAULT_PAGESIZE, type);
  }

  const row = (item, sectionID, rowID) => {
    return (
      <div className='list font-14' key={rowID}>
        <p className='title'>
          <span>{item.type}</span>
          <span className={`${item.isDebt ? 'out' : 'in'} font-18`}>
            {item.isDebt ? '-' : '+'}{item.amount}
          </span>
        </p>
        <p className='desc'>{item.createTimestamp}</p>
      </div>
    );
  };

  return (
    <div className="transactions-page">
      <Heading title='Transactions' />
      <div className='filter font-14 text-center'>
        <div className={`fil text-center ${filterType == 'ALL' ? 'current' : ''}`} onClick={()=>{filter('ALL')}}>All</div>
        <div className={`fil text-center ${filterType == 'DEBT' ? 'current' : ''}`} onClick={()=>{filter('DEBT')}}>Debt</div>
        <div className={`fil text-center ${filterType == 'CREDIT' ? 'current' : ''}`} onClick={()=>{filter('CREDIT')}}>Credit</div>
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
            <p className='font-14 title'>no transition</p>
        }
      </div>
    </div>
  );
}

export default Transactions;
