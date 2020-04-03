/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-03 23:22:28
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
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
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/users/transations?pageIndex=1&&pageSize=999&queryType=${type}`,
      data: {
        pageIndex: 1,   // 从1开始
        pageSize: 999,
        queryType: type  // ALL DEBT CREDIT
      },
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setTransData(response.data.data);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
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
              return <div className='list font-14'>
                <p className='title'>
                  <span>{item.type}</span>
                  <span className={`${item.isDebt ? 'out' : 'in'} font-18`}>
                    {item.isDebt ? '-' : '+'}{item.amount}
                  </span>
                </p>
                <p className='desc'>{moment(item.createTimestamp).format('YYYY/MM/DD hh:mm:ss')}</p>
              </div>
            })
          ): <p className='font-14 text-center'>no transactions</p>
        }
      </div>
    </div>
  );
}

export default Transactions;
