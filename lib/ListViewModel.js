/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {createStore} from 'redux';

import ViewModel from './ViewModel';

export default class ListViewModel extends ViewModel
{
    static get defaultState(){
        return [];
    }
    getItemByKey(key, clazz, getter, reduceParent){
        return this.getSubViewModel(key, clazz, getter || (state=>{
                return state.find(v=>typeof(v) == 'object'?v.key == key : v == key);     // Return undefined if not exists.
            }), reduceParent || ((state, newValue)=>{
                var mark = false;
                var ret = state.map(v=>{
                    if (typeof(v) == 'object'?v.key == key : v == key){
                        mark = true;
                        return newValue;
                    }
                    return v;
                })
                if (!mark){
                    ret.push(newValue);
                }
                return ret;
            }))
    }
    _reduce(state, path, method, args) {
        if (!path || !path.length){
            // method on this;
            return this[method](state, ...args);
        } else {
            let key = path.shift();
            let sub = this[key] || this.getItemByKey(key);
            return sub._reduceParent(state, sub._reduce(sub._getter(state, key), path, method, args), key);
        }
    }
}
