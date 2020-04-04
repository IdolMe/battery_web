/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 14:38:38
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import {Payment, Checked, UnCheck, Term, Tip, PaySuccess} from '../assets/image/assetsImages';
import '../styles/topup.scss';

function TopUp() {
  const [visible, setVisible] = useState(false);
  const [rechargeData, setRechargeData] = useState();
  const [selectedIndex, setSelectIndex] = useState(0);   // 按照index来设置默认选中的充值item
  useEffect(() => {
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/users/recharge-item`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setRechargeData(response.data.data.rechargeItem);
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])

  let history = useHistory();
  const doPay = () => {
    Toast.show({type:'loading'});
    axios({
      method: 'POST',
      url: `${urlPrefix}/v1.0.0/payments/payby`,
      data: {
        rechargeItemId: rechargeData[selectedIndex].id,
        type: "TOPUP"
      },
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setVisible(true)
        setTimeout(() => {
          setVisible(false);
          // 充完钱去钱包
          history.push(`/wallet`);
        }, 800)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }

  return (
    <div className="topup-page">
      <div className='header-wrap'>
        <Heading title='Top-up' />
      </div>
      <div className='contents'>
        <p className='font-14 title'>Amount</p>
        <div className="amounts check text-center">
          {
            rechargeData && rechargeData.length > 0 ? (
              rechargeData.map((item, index) => {
                return <div className={`amount font-14 ${index == selectedIndex ? 'checkedAmount' : ''}`} 
                  onClick={()=>setSelectIndex(index)} key={index}>
                  AED<span className='font-32'>5</span></div>
              })
            ) : null
          }
        </div>
        <p className='font-14 title'>Payment method</p>
        <div className='method font-14'>
          <span><img src={Payment} alt="pay" className="logo" /> Pay1</span>
          <img src={Checked} alt="check" className="check" />
        </div>
        <div className='method font-14'>
          <span><img src={Payment} alt="pay" className="logo" /> Pay2</span>
          <img src={UnCheck} alt="check" className="check" />
        </div>
      </div>
      <div className='btns'>
        <p className='font-11'>
          <img src={Term} alt="term" />
          I agree to the terms & conditions of the Pricing Agreement.
          <img src={Tip} alt="tip" />
        </p>
        <div className="btn radius4 text-center font-fff font-18" onClick={doPay}>Top-up Now</div>
      </div>

      <Modal
        title=""
        visible={visible}
        closable={false}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
        destroyOnClose={true}
        onCancel={()=> {setVisible(false)}}
      >
        <div id="home-modal" className="text-center">
          <img src={PaySuccess} alt="tip-img" className="topImg" />
          <h4 className="font-16">Success</h4>
        </div>
      </Modal>
    </div>
  );
}

export default TopUp;
