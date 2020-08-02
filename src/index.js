/**
* @file: description
* @author: huguantao
* @Date: 2020-02-04 15:05:53
* @LastEditors: huguantao
* @LastEditTime: 2020-06-19 21:47:12
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes/index.js';
import "lib-flexible"

import * as serviceWorker from './serviceWorker';
import './styles/index.scss';

ReactDOM.render(
    <Routes />, document.getElementById('root')
);

serviceWorker.unregister();
