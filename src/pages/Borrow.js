/**
* @file: description
* @author: huguantao
* @Date: 2020-03-09 15:49:17
* @LastEditors: huguantao
* @LastEditTime: 2020-04-16 15:53:56
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Progress, Modal } from 'antd-mobile';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import '../styles/borrow.scss';
import { TimeClock, PowerBankDefault} from '../assets/image/assetsImages';

function Borrow() {
  let [percent, setPercent] = useState(0);  // 借用中的进度条比例
  const [borrowSuccess, setBorrowSuccess] = useState(false); 
  const [borrowData, setBorrowData] = useState();  // 借用成功的插槽数据
  let [takeTime, setTakeTime] = useState(0);    // 借用超时时间
  const [visible, setVisible] = useState(false);

  let history = useHistory();

  let takeInterval;

  useEffect(() => {
    doBorrow();
    return () => {
      // 清除设置的超时未取走的定时器
      clearInterval(takeInterval)
    }
  }, []);

  const doBorrow = () => {
    let interval = null;
    setTimeout(() => {
      interval = setInterval(() => {
        if(percent > 99) {
          clearInterval(interval);
        } else {
          setPercent(percent++)
        }
      }, 20);
    });

    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/stations/${sessionStorage.getItem('BOXID')}/borrowing`, 'POST', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        // 借用成功，进度条设置为100，取消定时器。显示借用成功页面
        setPercent(100);
        clearInterval(interval);

        // 设置超时未取走的时间
        setTakeTime(res.data.automaticReturnDuration);

        setBorrowData(res.data);
        setBorrowSuccess(true);

        // 开始定时设置超时未取走的状态; 如果超时没取走，则提示
        takeInterval = setInterval(() => {
          if(takeTime <= 0) {
            clearInterval(takeInterval);

            history.replace('/usingDetail');
            // setVisible(true)  这是超时的弹窗提示，改成直接跳转
          }
          setTakeTime(takeTime--);
        }, 1000);
      }
    })
  }

  const goBack = () => {
    setVisible(false);
    history.goBack();
  };

  const tryAgain = () => {
    setVisible(false);
    // 重试，需要重置超时、进度条、借用状态； 并重新请求接口
    setPercent(0);
    setBorrowSuccess(false);
    doBorrow()
  };

  return (
    <div className="borrow-page font-fff">
      <Heading goto='/home' />
      <div className="content font-fff font-16">
        <h3 className='font-fff font-24 padding'>{borrowSuccess ? 'Please take the powerbank' : 'Processing, Please wait'}</h3>
        { borrowSuccess ? 
          <div className='borrowed'>
            <p className='remind text-center'>Please take the powerbank from slot #{borrowData && borrowData.slot}</p>
            <img src={borrowData && borrowData.slotImageUrl} alt='slot' className='slot' />
            <p className='font-fff text-center font-13 time'><img src={TimeClock} alt='time' />{takeTime}''</p>
            <p className='font-fff text-center font-13'>Please take the powerbank in time</p>
          </div> : 
          <div className='processing padding'>
            <img src={PowerBankDefault} alt='slot' className='slot' />
            <div className='percentBar'>
              <span className='tip font-13 text-center' style={{left: `${percent}%`}}>{percent}%</span>
              <Progress percent={percent} showInfo={false} position='normal' unfilled={true} strokeColor="#ffffff" barStyle={{
                borderColor: '#ffffff',
                borderWidth: '3px',
                borderRadius: '4px'
              }}/>
              <p className='font-fff text-center font-13'>Please wait</p>
            </div>
          </div>
        }
      </div>
      <Modal
        title=""
        visible={visible}
        closable={false}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
        destroyOnClose={true}
      >
        <div id="borrow-modal" className="text-center">
          <h4 className="font-16">Automatically returned</h4>
          <p className="font-14 gray">The powerbank has been automatically returned due to not removing the powerbank in time.</p>
          <div className="btns font-14 text-center" >
            <div className='btn back' onClick={goBack}>Back</div>
            <div className='btn again' onClick={tryAgain}>Try again</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Borrow;
