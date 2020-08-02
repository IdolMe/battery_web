/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-04-13 20:42:00
 */
import React, {useState, useEffect} from 'react';
import Heading from '../components/Heading';
import ReactDOM from 'react-dom';
import '../styles/wallet.scss';

function CustomerService() {
  const [height, setHeight] = useState(document.documentElement.clientHeight);
  let wrap;

  useEffect(() => {
    const hi = document.documentElement.clientHeight - ReactDOM.findDOMNode(wrap).offsetHeight;
    setHeight(hi);
  });
  return (
    <div className="wallet-page">
      <div className='header-wrap' ref={el => wrap = el}>
        <Heading title='Customer Service' />
      </div>
      <iframe
        src='https://m.payby.com/platform/payby/customerService'
        id='iframe'
        width='100%'
        height={height}
        scrolling='no'
        frameBorder={0}
      />
      
    </div>
  );
}

export default CustomerService;
