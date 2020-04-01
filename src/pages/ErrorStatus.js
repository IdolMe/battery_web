/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-03-31 22:08:53
 */
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {ConnectFail, NetworkFail, Repairing} from '../assets/image/assetsImages';

const statuses = [{
  img: ConnectFail,
  desc: ['Connection failed. Please try again.'],
},{
  img: NetworkFail,
  desc: ['This station is not found in the network. Please try with another nearby station.'],
},{
  img: Repairing,
  desc: ['This station is awaiting for repair. Please try with another nearby station.'],
}];

const imgStyle = {
  display: 'block',
  width: '76%',
  margin: '10% auto 5%'
}
const pStyle = {
  display: 'block',
  width: '83%',
  margin: '0 auto',
  color: 'rgba(0,0,0,0.85)'
}
const btnStyle = {
  display: 'block',
  margin: '0 auto',
  background: '#00A75D',
  color: '#ffffff',
  marginTop: '14%',
  width: '40%',
  padding: '2vw 3vw'
}

function ErrorStatus(prop) {
  // type: t0:连接失败 t1:未发现  t2:维修中
  const type = prop.match.params.type || 't0';
  const [status, setStatus] = useState(statuses[0]);

  useEffect(() => {
    if(type === 't1') {
      setStatus(statuses[1])
    } else if(type === 't2') {
      setStatus(statuses[2])
    }
  }, [type])

  let history = useHistory();
  const goHome = () => {
    history.push(`/home`);
  }

  return (
    <div className="error-status-page">
      <Heading />
      <img src={status.img} alt='logo' style={imgStyle} />
      {
        status.desc.map((item, index) => {
          return <p style={pStyle} className='font-14 text-center' key={index}>{item}</p>
        })
      }
      <div onClick={goHome} className='font-18 text-center radius4' style={btnStyle}>Back to home</div>
    </div>
  );
}

export default ErrorStatus;
