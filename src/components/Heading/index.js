/**
* @file: description
* @author: huguantao
* @Date: 2020-02-29 19:57:23
* @LastEditors: huguantao
* @LastEditTime: 2020-04-15 23:29:07
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { GoBackBlack } from '../../assets/image/assetsImages';
import './index.scss';
import Toast from '../Toast/Toast';

/**
 * 
 * @param {*} prop : type=exit 则调原生方法退出h5  有goto则跳转goto，否则回退到上页
 */
function Heading(prop) {
  const [title, setTitle] = useState(prop.title || 'PAYBY');

  useEffect(() => {
    if(prop.type && prop.type == 'exit') {
      setTitle('');
    }
  }, [prop])

  let history = useHistory();
  const goBack = () => {
    if(prop.type && prop.type === 'exit') {
      // 退出h5
      window.ToPayJSBridge.invoke('leaveWeb');
    } else if(prop.goto) {
      history.push(prop.goto);
    } else {
      history.goBack();
    }
  }

  return (
    <div className="pages-header-wrap">
      <div className='pages-header'>
        <img src={GoBackBlack} alt='goBack' onClick={goBack} />
        <span>{title}</span>
      </div>
    </div>
  );
}

export default Heading;
