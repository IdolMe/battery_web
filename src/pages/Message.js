/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-03 23:02:28
 */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import Toast from '../components/Toast/Toast';
import { urlPrefix } from '../utils/constants';
import Heading from '../components/Heading';
import '../styles/message.scss';

function Message() {
  const [messages, setMessages] = useState();
  useEffect(() => {
    Toast.show({type:'loading'});
    axios({
      method: 'GET',
      url: `${urlPrefix}/v1.0.0/messages`,
      data: {
        pageIndex: 1,
        pageSize: 999
      },
      headers: {
        'userToken': sessionStorage.getItem('USERTOKEN'),
        'client-platform': 'WEB',
      }
    }).then(function(response) {
      Toast.hide();
      if(response.data.httpStatusCode === 200) {
        setMessages(response.data.data)
      } else {
        Toast.show({mess: response.data.error.message});
      }
    });
  }, [])

  return (
    <div className="message-page">
      <div className='header-wrap'>
        <Heading />
      </div>
      <div className='messages'>
        <h3 className='font-24 title'>Message</h3>
        {
          messages && messages.list && messages.list.length > 0 ? (
            messages.list.map((item, index) => {
              return <div className='message font-14 radius4' key={index}>
                <div className='messageTitle'>
                  <span>{item.title}</span>
                  <span>{moment(item.createTimestamp).format('YYYY/MM/DD hh:mm:ss')}</span>
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
