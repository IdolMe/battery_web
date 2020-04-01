/**
* @file: description
* @author: huguantao
* @Date: 2020-02-21 23:37:34
* @LastEditors: huguantao
* @LastEditTime: 2020-04-01 20:44:17
 */
import React,{Component} from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../pages/Home';
import UsingDetail from '../pages/UsingDetail';     // 使用中的详情
import UnpaidDetail from '../pages/UnpaidDetail';   // 已归还未支付的详情

import Loading from '../pages/Loading';             // 过渡页 暂不用
import RentProcess from '../pages/RentProcess';     // 租借流程：分付了押金和没付押金的
import PayDeposit from '../pages/PayDeposit';       // 付押金
import Renting from '../pages/Renting';             // 租借loading
import PaySuccess from '../pages/PaySuccess';       // 在去了充电宝很快还了，或者超时没拿充电宝触发

import ErrorStatus from '../pages/ErrorStatus';     // 错误状态比如 机器损坏 设备未联网 信号不好

// 账户相关
import Account from '../pages/Account';
import Wallet from '../pages/Wallet';               // 钱包
import OrderList from '../pages/OrderList';         // 订单列表，从账户页进   
import OrderDetail from '../pages/OrderDetail';
import TopUp from '../pages/TopUp';                 // 充值
import Message from '../pages/Message';
import Transactions from '../pages/Transactions';   // 交易记录，从钱包进
import ReFund from '../pages/ReFund';               // 退押金
import ReFundSuccess from '../pages/ReFundSuccess'; // 退押金成功

class Routes extends Component {
    render(){
        return (
            <BrowserRouter>
                {/* <Head  /> */}
                <Switch>
                    <Route path="/" component={Login} exact />
                    <Route path="/login" component={Login} />
                    <Route path="/home" component={Home} />
                    <Route path="/usingDetail" component={UsingDetail} />
                    <Route path="/unpaidDetail" component={UnpaidDetail} />
                    <Route path="/loading" component={Loading} />
                    <Route path="/rentProcess/:deposited" component={RentProcess} />
                    <Route path="/errorStatus/:type" component={ErrorStatus} />
                    <Route path="/payDeposit" component={PayDeposit} />
                    <Route path="/renting" component={Renting} />
                    <Route path="/paySuccess" component={PaySuccess} />
                    
                    <Route path="/account" component={Account} />
                    <Route path="/wallet" component={Wallet} />
                    <Route path="/orderList" component={OrderList} />
                    <Route path="/orderDetail/:id" component={OrderDetail} />
                    <Route path="/topup" component={TopUp} />
                    <Route path="/message" component={Message} />
                    <Route path="/transactions" component={Transactions} />
                    <Route path="/reFund" component={ReFund} />
                    <Route path="/reFundSuccess" component={ReFundSuccess} />

                    <Route component={Login} /> 
                </Switch>
                {/* <Footer /> */}
            </BrowserRouter>
        )
    }
}

export default Routes
