/**
 * @file: description
 * @author: huguantao
 * @Date: 2020-03-25 21:49:06
 * @LastEditors: huguantao
 * @LastEditTime: 2020-05-07 22:48:18
 */
import React, { useState, useEffect } from 'react';
import Heading from '../components/Heading';
import { request } from '../utils/request';
import { PullToRefresh, ListView, Button } from 'antd-mobile';
import { DEFAULT_PAGESIZE } from '../utils/constants';
import ReactDOM from 'react-dom';
import '../styles/message.scss';

function Message() {
  const [data, setData] = useState([]);
  const [dataSource, setDataSource] = useState(new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [total, setTotal] = useState(0);

  const getMessageList = async (pageNo, pageSize = DEFAULT_PAGESIZE) => {
    const headers = {
      'userToken': sessionStorage.getItem('USERTOKEN'),
      'client-platform': 'WEB',
    };
    const res = await request(`/v1.0.0/messages?pageIndex=${ pageNo }&pageSize=${ pageSize }`, 'GET', {}, headers);
    if (res.httpStatusCode === 200) {
      const prevData = pageNo === 1 ? [] : data;
      const nextData = [...prevData, ...res.data.list];
      setData(nextData);
      setDataSource(dataSource.cloneWithRows(nextData));
      setIsLoading(false);
      setRefreshing(false);
      setTotal(res.data.totalItems);
    }
  }

  const onEndReached = () => {
    if (isLoading || total <= pageNo * DEFAULT_PAGESIZE) {
      return;
    }
    setIsLoading(true);
    const nextPageNo = pageNo + 1;
    setPageNo(nextPageNo);
    getMessageList(nextPageNo, DEFAULT_PAGESIZE, true);
  }

  const onRefresh = () => {
    setRefreshing(true);
    setPageNo(1);
    getMessageList(1, DEFAULT_PAGESIZE);
  }

  useEffect(() => {
    getMessageList(1, DEFAULT_PAGESIZE);
  }, [])

  // useEffect(() => {
  //   document.documentElement.style.overflow = 'hidden';
  // });

  const row = (rowData, sectionID, rowID) => {
    return (
      <div className='message font-14 radius4' key={ rowID }>
        <div className='messageTitle'>
          <span>{ rowData.title }</span>
          <span>{ rowData.createTimestamp }</span>
        </div>
        <div className='desc'>{ rowData.content }</div>
      </div>
    );
  };

  return (
    <div className="message-page">
      <div className='header-wrap'>
        <Heading title='Message'/>
      </div>
      <div className='messages'>
        {
          data && data.length ?
            <ListView
              dataSource={ dataSource }
              renderFooter={ () => (<div style={ { padding: 30, textAlign: 'center' } }>
                { isLoading ? 'Loading...' : 'Loaded' }
              </div>) }
              renderRow={ row }
              useBodyScroll={ true }
              pullToRefresh={ <PullToRefresh
                refreshing={ refreshing }
                onRefresh={ onRefresh }
                indicator={ {
                  activate: null,
                  finish: null,
                  deactivate: null,
                  release: null,
                } }
              /> }
              onEndReachedThreshold={ 30 }
              onEndReached={ onEndReached }
              pageSize={ DEFAULT_PAGESIZE }
            /> :
            <p className='font-14 title'>no message</p>
        }
      </div>
    </div>
  );
}

export default Message;
