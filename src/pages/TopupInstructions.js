/**
* @file: 充值说明
* @author: huguantao
* @Date: 2020-05-7 21:49:06
* @LastEditors: huguantao
* @LastEditTime: 2020-05-07 22:44:45
 */
import React from 'react';
import Heading from '../components/Heading';
import '../styles/topupIntro.scss';

function TopupIntro() {

  return (
    <>
      <Heading title='Top-up Instructions' />
      <div className="topup-intro-page">
        <h3>Account Balance</h3>
        <p>Account balance can only be used to pay for the rental fees of powerbanks. It cannot be used to pay for deposit, to transferred or gifted to another account.</p>
        <h3>Deduction Rules</h3>
        <p>The payment would try to deduct remaning cash first, then remaining gifted balance (if exists).</p>
        <h3>Wallet cash withdrawal</h3>
        <p>Any remaining account balance from top-up can be withdrawal at any time. You could contact our customer service to get the cash back to your original deposit account. The withdrawal process usually takes 1-7 business days. All gifted balance would be cancelled after the withdrawal.</p>
        <h3>Expiration rules</h3>
        <p>Top-up balance does not expire. The balance would remain on the account even after deposit has been withdrawn. You could continue to spend them as usual.</p>
        <h3>Deposit Withdrawal</h3>
        <p>Deposit can be withdrawal at any time. The deposit would be sent back to the original deposit account. Processing time may vary upon third-party gateway processing time.</p>
      </div>
    </>
  );
}

export default TopupIntro;
