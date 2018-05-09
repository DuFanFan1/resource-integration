import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Redirect, IndexLink,} from 'react-router';
import {HashRouter,Link} from 'react-router-dom';
import RouterIndex from './routers/index.js';
ReactDOM.render(<RouterIndex/>, document.getElementById('react-container'));
// ReactDOM.render(<App/>, document.getElementById('react-container'));

