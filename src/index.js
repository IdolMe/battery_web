/**
* @file: description
* @author: huguantao
* @Date: 2020-02-04 15:05:53
* @LastEditors: huguantao
* @LastEditTime: 2020-03-24 23:57:05
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/index.js';
import "lib-flexible"

// import "./locales/index";
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './styles/index.scss';

ReactDOM.render(
    <Routes />, document.getElementById('root')
);

serviceWorker.unregister();
