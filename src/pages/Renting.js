/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-03-27 16:07:24
 */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {Logo} from '../assets/image/assetsImages';

const style = {
  display: 'block',
  margin: '25% auto 0',
  width: '33%'
}

function Renting() {
  let history = useHistory();
  const doLogin = () => {
    history.push(`/rentProcess/unpaid`);
  }

  return (
    <div className="renting-page">
      <Heading />
      <img src={Logo} alt='logo' style={style} />
      renting
    </div>
  );
}

export default Renting;
