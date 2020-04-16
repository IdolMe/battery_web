/**
* @file: description
* @author: huguantao
* @Date: 2020-03-09 15:49:17
* @LastEditors: huguantao
* @LastEditTime: 2020-04-15 23:38:26
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Modal } from 'antd';
import {request} from '../utils/request';
import '../styles/home.scss';
import {Home_bg, Home_my, Home_exit, Home_scan, Home_using, Home_toPay} from '../assets/image/assetsImages';
import Toast from '../components/Toast/Toast';

const msgs = [{
  img: Home_using,
  title: 'Tips',
  desc: ['You have a in-use powerbank', 'Thank you for your trust and support'],
  btn: 'View details',
  path: 'usingDetail'
},{
  img: Home_toPay,
  title: 'Tips',
  desc: ['You have an unpaid order. ', 'Please finish the previous payment to proceed.', 'Thank you.'],
  btn: 'View details',
  path: 'unpaidDetail'
}]

function Home() {
  const [visible, setVisible] = useState(false);
  const [tipMsg, setTipMsg] = useState({ img: '', title: '', desc: [], btn: '', path: ''});
  const [userData, setUserData] = useState({});
  const [stationData, setStationData] = useState({});

  let history = useHistory();
  
  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/users/status`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setUserData(res.data);
        // 租用状态 USING：使用中， OVERDRAFT：未结清， FINISH：完成，OVERDUE_SETTLEMENT：逾期结算扣押金，NONE：没有订单
        if(res.data.status == 'USING') {
          setVisible(true);
          setTipMsg(msgs[0]);
        } else if(res.data.status == 'OVERDRAFT') {
          setVisible(true);
          setTipMsg(msgs[1]);
        }
        //  else if(res.data.status == 'OVERDUE_SETTLEMENT') {
        //   history.push(`/payDeposit`);
        // }
      }
    })

  }, []);

  // 扫二维码，拿到boxid，查询机柜状态，然后再走start函数
  const scan = () => {
    window.ToPayJSBridge.invoke(
      'scanQRCode',
      {
        needResult: true, // 商户ID
      },
      function (data) {
        Toast.show({mess: JSON.parse(data)});
        // 拿到扫码的数据，截取boxId参数并存入缓存

        if(data.indexOf('powerbank') > -1) {
          const param = data.split('?')[1].split('&');
          for(let i=0; i<param.length; i++) {
            if(param[i].indexOf('boxId') > -1) {
              sessionStorage.setItem('BOXID', param[i].split('=')[1]);
              if(userData.status == 'OVERDUE_SETTLEMENT') {
                history.push(`/payDeposit`);
              } else {
                fetchStationData()
              }
            }
          }
        } else {
          // TODO测试用 默认boxid代码  后面要删除
          sessionStorage.setItem('BOXID', 'RL3H081911090084');
          if(userData.status == 'OVERDUE_SETTLEMENT') {
            history.push(`/payDeposit`);
          } else {
            fetchStationData()
          }
        }

      }
    )
  }

  // 获取机柜状态
  const fetchStationData = () => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB'
    };
    request(`/v1.0.0/staions/${sessionStorage.getItem('BOXID')}`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setStationData(res.data);
        start();
      }
    })
  }

  const start = () => {
    if(stationData.station.status == 'REPAIR') {
      // 机柜状态：{ONLINE：在线, REPAIR：维修中, NOT_FIND：没有发现机柜,TIMEOUT: 超时}
      history.push(`/errorStatus/t2`);
    } else if(stationData.station.status == 'NOT_FIND') {
      history.push(`/errorStatus/t1`);
    } else if(stationData.station.status == 'TIMEOUT') {
      history.push(`/errorStatus/t0`);
    } else if(stationData.station.status == 'ONLINE') {

      // 租用状态 USING：使用中， OVERDRAFT：未结清，
      if(userData.status == 'USING') {
        setVisible(true);
        setTipMsg(msgs[0]);
      } else if(userData.status == 'OVERDRAFT') {
        setVisible(true);
        setTipMsg(msgs[1]);
      }
      // 根据是否交了押金跳转
      else if(stationData.hasDeposit) {
        history.push(`/rentProcess/paid`);
      } else {
        history.push(`/rentProcess/unpaid`);
      }
    }
  }

  const exit = () => {
    // 退出h5
    window.ToPayJSBridge.invoke('leaveWeb');
  }

  const gotoMy = () => {
    history.push(`/account`);
  }

  const gotoDetail = (path) => {
    // 跳转到未支付或者使用中的订单
    setVisible(false);
    history.push(`/${path}`);
  }


  return (
    <div className="home-page">
      <img src={Home_bg} alt="bg" className="bg" />
      <div className="content font-fff font-16">
        <img src={Home_scan} alt="scan" className="scan" onClick={scan} />
        <div className='items'>
          <div className="item" onClick={exit}>
            <img src={Home_exit} alt="exit" />
            <p>Exit</p>
          </div>
          <div className="item" onClick={gotoMy}>
            <img src={Home_my} alt="my" />
            <p>Account</p>
          </div>
        </div>
      </div>
      <Modal
        title=""
        visible={visible}
        closable={false}
        footer={[]} // 设置footer为空，去掉 取消 确定默认按钮
        destroyOnClose={true}
        mask={false}
        maskClosable={false}
        zIndex={1000}
        onCancel={()=> {setVisible(false)}}
      >
        <div id="home-modal" className="text-center">
          <img src={tipMsg.img} alt="tip-img" className="topImg" />
          <h4 className="font-16">{tipMsg.title}</h4>
          {
            tipMsg.desc.map((item, index) => {
              return <p className="font-12" key={index}>{item}</p>
            })
          }
          <div className="btn radius4 font-fff font-14" onClick={()=>gotoDetail(tipMsg.path)}>{tipMsg.btn}</div>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
