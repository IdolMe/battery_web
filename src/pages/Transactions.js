/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 21:53:14
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import '../styles/transactions.scss';

function Transactions() {
  const [filterType, setFilterType] = useState(1);

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
        'type': 'DEPOSIT'  // DEPOSIT RENT TOPUP
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {

      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])

  const filter = (type) => {
    if(type == 2) {
      // debt
      setFilterType(2)
    } else if(type == 3) {
      // credit
      setFilterType(3)
    } else {
      // all
      setFilterType(1)
    }
  }

  return (
    <div className="transactions-page">
      <Heading title='Transactions' />
      <div className='filter font-14 text-center'>
        <div className={`fil text-center ${filterType == 1 ? 'current' : ''}`} onClick={()=>{filter(1)}}>All</div>
        <div className={`fil text-center ${filterType == 2 ? 'current' : ''}`} onClick={()=>{filter(2)}}>Debt</div>
        <div className={`fil text-center ${filterType == 3 ? 'current' : ''}`} onClick={()=>{filter(3)}}>Credit</div>
      </div>
      <div className='lists'>
        <div className='list font-14'>
          <p className='title'>
            <span>Credit - Deposit</span>
            <span className='in font-18'>+99</span>
          </p>
          <p className='desc'>18-03-2020 14:57:47</p>
        </div>
        <div className='list font-14'>
          <p className='title'>
            <span>Debt - Payment</span>
            <span className='out font-18'>-99</span>
          </p>
          <p className='desc'>18-03-2020 14:57:47</p>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
