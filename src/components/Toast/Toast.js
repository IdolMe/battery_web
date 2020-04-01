/**
* @file: description
* @author: huguantao
* @Date: 2020-02-04 15:05:53
* @LastEditors: huguantao
* @LastEditTime: 2020-03-31 23:42:34
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ToastBasic from './component';

const div = document.createElement("div");
document.body.appendChild(div);
const container = ReactDOM.render(<ToastBasic />, div);

function show(opt) {
  container.show(opt || {});
}

function hide() {
  container.hide();
}

const Toast = {
  show,
  hide
};

export default Toast;