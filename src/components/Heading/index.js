/**
* @file: description
* @author: huguantao
* @Date: 2020-02-29 19:57:23
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 22:34:03
 */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { GoBackBlack } from '../../assets/image/assetsImages';
import './index.scss';

function Heading(prop) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if(prop.type && prop.type != 'exit') {
      setTitle(prop.title || 'PAYBY');
    }
  }, [prop])

  let history = useHistory();
  const goBack = () => {
    if(prop.type && prop.type === 'exit') {
      // 退出h5
      window.ToPayJSBridge.invoke('leaveWeb');
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
