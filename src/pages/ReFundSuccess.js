/**
* @file: description
* @author: huguantao
* @Date: 2020-03-29 12:25:45
* @LastEditors: huguantao
* @LastEditTime: 2020-04-08 00:23:00
 */
/**
* @file: description
* @author: huguantao
* @Date: 2020-03-25 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-03-29 12:50:38
 */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Heading from '../components/Heading';
import {Checked} from '../assets/image/assetsImages';
import '../styles/reFund.scss';

function ReFundSuccess() {

  let history = useHistory();
  const done = () => {
    history.push(`/home`);
  }

  return (
    <div className="reFund-page">
      <Heading title='Refund Request' />
      <div className='card radius4'>
        <img src={Checked} alt='checked' className='img' />
        <p className='font-14 text-center'>Deposit withdrawal succeed</p>
        <p className='font-14 text-center green'> <span>AED 99</span></p>
        <p className='font-14 text-center red redTop'>1-3 business days, original card/account</p>
      </div>

      <div className='bottom-btns'>
        <p className='font-13 normal descs'>Refund information</p>
        <p className='font-13 normal descs'>After the refund request is submitted, it usually takes 1-3 business days to process, vary upon payment gateway processing time. Please contact our customer service if you encountered any issues.</p>
        <div className="btn radius4" onClick={done}>Done</div>
      </div>
    </div>
  );
}

export default ReFundSuccess;
