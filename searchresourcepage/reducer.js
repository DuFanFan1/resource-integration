import { combineReducers } from 'redux'

function search_module2(state = {}, action) {
    switch (action.type) {
        case 'setResourceId':
            console.log("setResourceId");
            console.log(action.payload);
            return { resourceid: action.payload };
        default:
            return state;
    }
}

export default combineReducers({
    search_module2,
})