import React, { Component } from 'react';
import { Router, Route} from 'react-router';
import { Link, HashRouter } from 'react-router-dom';

//个人中心
import User_Index from '../components/user/User_Index.js';
import MyInformation from '../components/user/MyInformation.js';
import ReviseInformation from '../components/user/ReviseInformation.js';
import RevisePassword from '../components/user/RevisePassword.js';

export default class RouterUser extends Component {
    render() {
        return (
            <User_Index>
                <Route path="/App/User_Index/MyInformation" component={MyInformation} />
                <Route path="/App/User_Index/ReviseInformation" component={ReviseInformation} />
                <Route path="/App/User_Index/RevisePassword" component={RevisePassword} />
            </User_Index>
        )
    }
}