/**
* @file: description
* @author: huguantao
* @Date: 2020-03-09 15:49:17
* @LastEditors: huguantao
* @LastEditTime: 2020-04-04 13:06:11
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Progress, Modal } from 'antd';
import axios from 'axios';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import '../styles/borrow.scss';
import { TimeClock, Home_scan} from '../assets/image/assetsImages';

const TIMEOUT = 90;

function Borrow() {
  let [percent, setPercent] = useState(0);  // 借用中的进度条比例
  const [borrowSuccess, setBorrowSuccess] = useState(false); 
  const [borrowData, setBorrowData] = useState();  // 借用成功的插槽数据
  let [takeTime, setTakeTime] = useState(TIMEOUT);    // 借用超时时间
  const [visible, setVisible] = useState(false);

  let history = useHistory();

  useEffect(() => {
    doBorrow();
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

    // /v1.0.0/staions/{boxId}/borrowing 借充电宝
    axios({
      method: 'POST',
      url: `${urlPrefix}/v1.0.0/staions/${sessionStorage.getItem('BOXID')}/borrowing`,
      data: {},
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB'
      }
    }).then(function(response) {
      if(response.data.httpStatusCode === 200) {
        // 借用成功，进度条设置为100，取消定时器。显示借用成功页面
        setPercent(100);
        clearInterval(interval);

        setBorrowData(response.data.data);
        setBorrowSuccess(true);

        // 开始定时设置超时未取走的状态; 如果超时没取走，则提示
        let takeInterval = setInterval(() => {
          if(takeTime <=0) {
            clearInterval(takeInterval);
            setVisible(true)
          }
          setTakeTime(takeTime--);
        }, 1000);
      } else {
        clearInterval(interval);
        Toast.show({mess: response.data.error.message});
      }
    });
  }

  const goBack = () => {
    setVisible(false);
    history.goBack();
  };

  const tryAgain = () => {
    setVisible(false);
    // 重试，需要重置超时、进度条、借用状态； 并重新请求接口
    setTakeTime(TIMEOUT);
    setPercent(0);
    setBorrowSuccess(false);
    doBorrow()
  };


  return (
    <div className="borrow-page font-fff">
      <Heading />
      <div className="content font-fff font-16">
        <h3 className='font-fff font-24 padding'>{borrowSuccess ? 'Please take the powerbank' : 'Processing, Please wait'}</h3>
        { borrowSuccess ? 
          <div className='borrowed'>
            <p className='remind text-center'>Please take the powerbank from slot #{borrowData && borrowData.slot}</p>
            <img src={Home_scan} alt='slot' className='slot' />
            <p className='font-fff text-center font-13 time'><img src={TimeClock} alt='time' />{takeTime}''</p>
            <p className='font-fff text-center font-13'>Please take the powerbank in time</p>
          </div> : 
          <div className='processing padding'>
            <div className='percentBar'>
              <span className='tip font-13 text-center' style={{left: `${percent}%`}}>{percent}%</span>
              <Progress percent={percent} showInfo={false} strokeColor="#ffffff" />
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