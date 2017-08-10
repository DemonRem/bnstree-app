import {combineReducers} from 'redux-immutable'
import {List, fromJS} from 'immutable'
import * as actionType from './actionTypes'

function list(state = List(), action) {
    switch (action.type) {
        case actionType.SET_STREAM_LIST:
            return fromJS(action.list)
        default:
            return state
    }
}

export default combineReducers({list})
