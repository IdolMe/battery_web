/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-03-28 15:43:00
 */
import React, {useState, useEffect} from 'react';
import Heading from '../components/Heading';
import '../styles/message.scss';

function Message() {

  return (
    <div className="message-page">
      <div className='header-wrap'>
        <Heading />
      </div>
      <div className='messages'>
        <h3 className='font-24 title'>Message</h3>
        <div className='message font-14 radius4'>
          <div className='messageTitle'>
            <span>Deposit successful</span>
            <span>2020/3/18 14:55</span>
          </div>
          <div className='desc'>You have paid for the deposit. Start getting the powerbank in an easy and fast fashion now.</div>
        </div>
        <div className='message font-14 radius4'>
          <div className='messageTitle'>
            <span>Deposit successful</span>
            <span>2020/3/18 14:55</span>
          </div>
          <div className='desc'>You have paid for the deposit. Start getting the powerbank in an easy and fast fashion now.</div>
        </div>
      </div>
    </div>
  );
}

export default Message;
