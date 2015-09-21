/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {createStore} from 'redux';

import ViewModel, {getSubState} from './ViewModel';

export default class ListViewModel extends ViewModel
{
    static get defaultState(){
        return [];
    }
    getItemByKey(key, clazz){
        clazz = clazz || ViewModel;
        return new clazz(this._store, [...this._path, key]);
    }
    _reduce(state, path, method, args) {
        if (!path || !path.length){
            // method on this;
            return this[method](state, ...args);
        } else {
            let key = path.shift();
            let sub = this.getItemByKey(key);
            return state.map(v=> {
                if (typeof(v) == 'object'? v.key == key : v == key){
                    return sub._reduce(getSubState(state, key), path, method, args);
                }
                return v;
            });
        }
    }
}
