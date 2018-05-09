import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Switch } from 'react-router';
import { Link, BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducer.js';
import Allresource from './sresource.js';
import ResourceDetail from './resourceDetail.js';
const store = createStore(Reducer)
export default class RouterIndex extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/ResourceDetail" component={ResourceDetail} />
                        <Allresource />
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}
ReactDOM.render(<RouterIndex />, document.getElementById('react-container'));