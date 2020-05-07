/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:48:18
 */
import React, {useState, useEffect} from 'react';
import Heading from '../components/Heading';
import {request} from '../utils/request';
import '../styles/message.scss';

function Message() {
  const [messages, setMessages] = useState();
  useEffect(() => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB',
    };
    request(`/v1.0.0/messages?pageIndex=1&pageSize=999`, 'GET', {}, headers ).then(res=> {
      if(res.httpStatusCode === 200) {
        setMessages(res.data)
      }
    })
  }, [])

  return (
    <div className="message-page">
      <div className='header-wrap'>
        <Heading title='Message' />
      </div>
      <div className='messages'>
        <h3 className='font-24 title' />
        {
          messages && messages.list && messages.list.length > 0 ? (
            messages.list.map((item, index) => {
              return <div className='message font-14 radius4' key={index}>
                <div className='messageTitle'>
                  <span>{item.title}</span>
                  <span>{item.createTimestamp}</span>
                </div>
            <div className='desc'>{item.content}</div>
              </div>
            })
          ) : <p className='font-14 title'>no message</p>
        }
      </div>
    </div>
  );
}

export default Message;
