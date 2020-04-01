/**
* @file: description
* @author: huguantao
* @Date: 2020-03-27 12:31:58
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 20:31:02
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Carousel} from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import {ProcessSwip1, ProcessSwip2, ProcessSwip3, ProcessIcon1, ProcessIcon2, ProcessIcon3, ProcessIcon4} from '../assets/image/assetsImages';
import '../styles/rentProcess.scss';

const swips = [{
  img: ProcessSwip1,
  title: 'Return to any station ',
  desc: 'Over XXX stations in UAE and still expanding'
},{
  img: ProcessSwip2,
  title: 'Support Most Mobile Devices',
  desc: 'Apple Lightning, Type-C, Micro-USB'
},{
  img: ProcessSwip3,
  title: 'Push to Start Charging',
  desc: 'Push the side button to start charging your mobile devices'
}];

const contents = [{
  img: ProcessIcon1,
  title: 'Name',
  desc: 'Address'
},{
  img: ProcessIcon2,
  title: 'Supports most smartphones and mobile devices with 3 different types of connectors.',
  desc: ''
},{
  img: ProcessIcon3,
  title: '1.5 AED/30 mins, Free for 5 minutes usage. ',
  desc: 'Cap at 20 AED daily maximum. Up to 99 AED maximum - the powerbank is yours!'
},{
  img: ProcessIcon4,
  title: 'Over XXX stations in UAE and still expanding',
  desc: ''
}];

function RentProcess(prop) {
  // 根据是否付了押金来展示不同的按钮
  const deposited = prop.match.params.deposited || 'unpaid';
  const [stationData, setStationData] = useState({});

  useEffect(() => {
    // /v1.0.0/staions/{boxId}  查询是否交了押金以及机柜状态
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/staions/${sessionStorage.getItem('BOXID')}`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setStationData(response.data.data);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])

  let history = useHistory();
  const pay = () => {
    history.push(`/payDeposit`);
  }
  const rent = () => {
    // 租借,只在有充电宝的时候跳转
    if(stationData.station.remaining > 0) {
      // TODO 租借流程
    } else {
      const conFirm = window.confirm('Sorry, no power bank available');
      if(conFirm == true) {
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
        <Heading />
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
        {
          contents.map((item, index) => {
            return <div className='content' key={index}>
              <img src={item.img} alt='img' />
              <div className='fonts'>
                <p className='title font-14'>{item.title}</p>
                <p className='desc font-11'>{item.desc}</p>
              </div>
            </div>
          })
        }
      </div>
      <p className='agrees font-11'>
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
              <div className={`btn font-18 radius4 ${stationData.station && (stationData.station.remaining > 0 ? '' : 'unable')}`} onClick={rent}>Rent a powerbank</div> 
              <div className='btn font-18 radius4 trans-btn' onClick={wallet}>Wallet</div> 
            </>
        }
      </div>
      
    </div>
  );
}

export default RentProcess;