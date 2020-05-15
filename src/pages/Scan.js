/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-22 21:52:26
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {getQueryString} from '../utils/helper';
import {request} from '../utils/request';
import {Loading} from '../assets/image/assetsImages';

const style = {
  display: 'block',
  margin: '35% auto 0',
  width: '50%'
}

function Scan() {
  let history = useHistory();
  const BOXID = getQueryString('boxId') || 'RL3H042003250001';  // 机柜id，APP会带过来 RL3H042003250001
  const access_token = getQueryString('access_token') || 'QUAqLHmzSDm6UYM6m1thx8'; // 用户token，APP会带过来
  sessionStorage.setItem('BOXID', BOXID);

  // APP的token鉴权换token登录方式
  useEffect(() => {
    const headers = {
      'access_token': access_token,
      'client-platform': 'WEB',
    };
    request(`/v1.0.0/authz`, 'POST', {}, headers, true ).then(res1=> {
      if(res1.httpStatusCode === 200) {
        sessionStorage.setItem('USERTOKEN', res1.data.token);
        // 先查看机柜状态：{ONLINE：在线, REPAIR：维修中, NOT_FIND：没有发现机柜,TIMEOUT: 超时}
        // 机柜正常之后再查看用户状态，跳转对应地址

        const headers = {
          'userToken': res1.data.token,
          'client-platform': 'WEB'
        };
        request(`/v1.0.0/stations/${sessionStorage.getItem('BOXID')}`, 'GET', {}, headers, true ).then(res2=> {
          if(res2.httpStatusCode === 200) {
            const stationData = res2.data;
            if(stationData.station.status == 'REPAIR') {
              // 机柜状态：{ONLINE：在线, REPAIR：维修中, NOT_FIND：没有发现机柜,TIMEOUT: 超时}
              history.push(`/errorStatus/t2`);
            } else if(stationData.station.status == 'NOT_FIND') {
              history.push(`/errorStatus/t1`);
            } else if(stationData.station.status == 'TIMEOUT') {
              history.push(`/errorStatus/t0`);
            } else {
              request(`/v1.0.0/users/status`, 'GET', {}, headers, true ).then(res3=> {
                if(res3.httpStatusCode === 200) {
                  // 租用状态 USING：使用中， OVERDRAFT：未结清， FINISH：完成，OVERDUE_SETTLEMENT：逾期结算扣押金，NONE：没有订单
                  if (res3.data.status == 'OVERDUE_SETTLEMENT') {
                    history.push(`/payDeposit`);
                  } else if(res3.data.status == 'USING' || res3.data.status == 'OVERDRAFT') {
                    history.push(`/home`);
                  } else {
                    if(stationData.hasDeposit) {
                      history.push(`/rentProcess/paid`);
                    } else {
                      history.push(`/rentProcess/unpaid`);
                    }
                  }
                }
              })
            }
          }
        })
      }
    })
  })

  return (
    <div className="loading-page">
      <Heading type='exit' />
      <img src={Loading} alt='logo' style={style} />
    </div>
  );
}

export default Scan;
