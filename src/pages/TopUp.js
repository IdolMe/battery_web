/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-13 20:42:07
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import Toast from '../components/Toast/Toast';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import {Payment, Checked, UnCheck, Term, Tip, PaySuccess} from '../assets/image/assetsImages';
import '../styles/topup.scss';

function TopUp() {
  const [visible, setVisible] = useState(false);
  const [rechargeData, setRechargeData] = useState();
  const [selectedIndex, setSelectIndex] = useState(0);   // 按照index来设置默认选中的充值item
  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/recharge-item`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setRechargeData(res.data.rechargeItem);
      }
    })
  }, [])

  let history = useHistory();
  const doPay = () => {

    const reqData = {
      rechargeItemId: rechargeData[selectedIndex].id,
      type: "TOPUP"
    };
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/payments/payby`, 'POST', reqData, headers ).then(resp=> {
      if(resp.httpStatusCode === 200) {
        
        const resData = resp.data;
        window.ToPayJSBridge.invoke(
          'ToPayRequest',
          {
            appId: resData.appId, // partnerId 
            token: resData.token // For order token, refer to the token in interactionParams returned from the transaction creation interface
          },
          function(data) {
            const res = JSON.parse(data)
            if (res.status === 'success') {
              // 支付成功之后停留五秒等待结果同步，然后展示成功并跳转
              Toast.show({type:'loading'});
              setTimeout(() => {
                Toast.hide();
                setVisible(true)
                setTimeout(() => {
                  setVisible(false);
                  // 付完押金去往租借页面
                  history.push(`/wallet`);
                }, 1500)
              }, 3500);

            } else {
              Toast.show({mess: 'pay failed, please try again'});
            }
          }
        )

      }
    })
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
          <span><img src={Payment} alt="pay" className="logo" /> PayBy</span>
          <img src={Checked} alt="check" className="check" />
        </div>
        {/* <div className='method font-14'>
          <span><img src={Payment} alt="pay" className="logo" /> Pay2</span>
          <img src={UnCheck} alt="check" className="check" />
        </div> */}
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
