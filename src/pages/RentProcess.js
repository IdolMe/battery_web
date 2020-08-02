/**
* @file: description
* @author: huguantao
* @Date: 2020-03-27 12:31:58
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:43:14
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Carousel } from 'antd-mobile';
import Heading from '../components/Heading';
import { request } from '../utils/request';
import { ProcessSwip1, ProcessSwip2, ProcessSwip3, ProcessIcon1, ProcessIcon2, ProcessIcon3, ProcessIcon4 } from '../assets/image/assetsImages';
import '../styles/rentProcess.scss';

const swips = [{
  img: ProcessSwip1,
  title: 'Return to any station ',
  desc: 'Over 1000 stations in UAE and still expanding'
}, {
  img: ProcessSwip2,
  title: 'Support Most Mobile Devices',
  desc: 'Apple Lightning, Type-C, Micro-USB'
}, {
  img: ProcessSwip3,
  title: 'Push to Start Charging',
  desc: 'Push the side button to start charging your mobile devices'
}];

// const contents = [
//   // {
//   //   img: ProcessIcon1,
//   //   title: 'Name',
//   //   desc: 'Address'
//   // },
//   {
//     img: ProcessIcon2,
//     title: 'Supports most smartphones and mobile devices with 3 different types of connectors.',
//     desc: ''
//   }, {
//     img: ProcessIcon3,
//     title: '1.5 AED/30 mins, Free for 5 minutes usage. ',
//     desc: 'Cap at 20 AED daily maximum. Up to 99 AED maximum - the powerbank is yours!'
//   }, {
//     img: ProcessIcon4,
//     title: 'Over XXX stations in UAE and still expanding',
//     desc: ''
//   }];

function RentProcess(prop) {
  // 根据是否付了押金来展示不同的按钮
  const deposited = prop.match.params.deposited || 'unpaid';
  const [stationData, setStationData] = useState();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };

    request(`/v1.0.0/users/status`, 'GET', {}, headers).then(res => {
      if (res.httpStatusCode === 200) {
        setUserData(res.data);

        request(`/v1.0.0/stations/${sessionStorage.getItem('BOXID')}`, 'GET', {}, headers).then(res1 => {
          if (res1.httpStatusCode === 200) {
            if (res1.data.station.status == 'REPAIR') {
              // 机柜状态：{ONLINE：在线, REPAIR：维修中, NOT_FIND：没有发现机柜,TIMEOUT: 超时}
              history.push(`/errorStatus/t2`);
            } else if (res1.data.station.status == 'NOT_FIND') {
              history.push(`/errorStatus/t1`);
            } else if (res1.data.station.status == 'TIMEOUT') {
              history.push(`/errorStatus/t0`);
            } else {
              setStationData(res1.data);
            }
          }
        });
      }
    })
  }, [])

  let history = useHistory();
  const pay = () => {
    history.push(`/payDeposit`);
  }
  const rent = () => {
    // 租借,只在有充电宝的时候跳转（且当前没订单的状态，如果有的话就不让去了）
    if (stationData.station.remaining > 0) {
      // 租用状态 USING：使用中， OVERDRAFT：未结清，
      if (userData.status == 'USING') {
        history.push(`/usingDetail`);
      } else if (userData.status == 'OVERDRAFT') {
        history.push(`/unpaidDetail`);
      } else {
        history.push(`/borrow`);
      }
    } else {
      const conFirm = window.confirm('Sorry, no power bank available');
      if (conFirm == true) {
        // 点击 确定
        console.log('ok')
      }
    }
  }
  const wallet = () => {
    history.push(`/wallet`);
  }

  return (
    <div className="rentProcess-page">
      <div className='top-swip'>
        <Heading goto='/home' />
        <div className='swips'>
          <Carousel autoplay>
            {
              swips.map((item, index) => {
                return <div key={index}>
                  <h3 className='font-24'>{item.title}</h3>
                  <p className='font-14'>{item.desc}</p>
                  <img src={item.img} alt='swip' />
                </div>
              })
            }
          </Carousel>
        </div>
      </div>
      <div className='contents'>
        <div className='content'>
          <img src={ProcessIcon1} alt='img' />
          <div className='fonts'>
            <p className='title font-14'>{stationData && stationData.station.name}</p>
            <p className='desc font-11'>{stationData && stationData.station.address}</p>
          </div>
        </div>
        <div className='content' >
          <img src={ProcessIcon2} alt='img' />
          <div className='fonts'>
            <p className='title font-14'>{stationData && stationData.station.supportDeviceCountInfo}</p>
          </div>
        </div>
        <div className='content' >
          <img src={ProcessIcon3} alt='img' />
          <div className='fonts'>
            <p className='title font-14'>{stationData && stationData.chargingInfo.title}</p>
            <p className='desc font-11'>{stationData && stationData.chargingInfo.description}</p>
          </div>
        </div>
        <div className='content' >
          <img src={ProcessIcon4} alt='img' />
          <div className='fonts'>
            <p className='title font-14'>{stationData && stationData.stationCountInfo}</p>
          </div>
        </div>
      </div>
      <p className='agrees font-11' onClick={() => { history.push('/userAgreement') }}>
        I agree to the terms and conditions of the End User License
        {/* <span>《用户协议》</span>
        <span>《充值说明》</span>
        <span>《委托扣款授权书》</span> */}
      </p>
      <div className='bottom-btn'>
        {
          deposited === 'unpaid' ?
            <div className='btn font-18 radius4' onClick={pay}>Pay a deposit</div>
            : <>
              <div className={`btn font-18 radius4 ${stationData && stationData.station && (stationData.station.remaining > 0 ? '' : 'unable')}`} onClick={rent}>Rent a powerbank</div>
              <div className='btn font-18 radius4 trans-btn' onClick={wallet}>Wallet</div>
            </>
        }
      </div>

    </div>
  );
}

export default RentProcess;