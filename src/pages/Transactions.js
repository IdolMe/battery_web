/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 23:23:46
 */
import React, {useState, useEffect} from 'react';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import '../styles/transactions.scss';

function Transactions() {
  const [filterType, setFilterType] = useState("ALL");
  const [transData, setTransData] = useState();

  useEffect(() => {
    getOrder(filterType);
  }, [])

  const filter = (type) => {
    setFilterType(type);
    getOrder(type);
  }

  const getOrder = (type) => {
    const data = {
      pageIndex: 1,   // 从1开始
      pageSize: 999,
      queryType: type  // ALL DEBT CREDIT
    };
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/transations?pageIndex=1&&pageSize=999&queryType=${type}`, 'GET', data, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setTransData(res.data);
      }
    })
  }

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
          transData && transData.list && transData.list.length > 0 ? (
            transData.list.map((item, index) => {
              return <div className='list font-14' key={index}>
                <p className='title'>
                  <span>{item.type}</span>
                  <span className={`${item.isDebt ? 'out' : 'in'} font-18`}>
                    {item.isDebt ? '-' : '+'}{item.amount}
                  </span>
                </p>
                <p className='desc'>{item.createTimestamp}</p>
              </div>
            })
          ): <p className='font-14 text-center'>no transactions</p>
        }
      </div>
    </div>
  );
}

export default Transactions;
