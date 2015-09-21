/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {createStore} from 'redux';

export default class ViewModel
{
    constructor(store, path, state){
        this._path = path || [];

        this._store = store || createStore((state, action)=>{
            return this.reduce(state, action);
        }, state === undefined ? (this.constructor).defaultState: state);
    }
    static get defaultState(){
         return undefined;
    }
    get store(){
        return this._store;
    }
    get path(){
        return this._path.join('.');
    }
    get state(){
        let ret = this._store.getState();
        this._path.forEach(v=>{
            ret = ret[v];
        })
        return ret;
    }
    set state(val){
        if (this._state !== val) {
            this._state = val;
        }
    }
    getSubViewModel(name, clazz){
        clazz = clazz || ViewModel;
        return new clazz(this._store, [...this._path, name]);
    }
    dispatch(method, ...Args){
        this._store.dispatch({
            type: "REDUX_VM_DISPATCH",
            path: this._path,
            method: method,
            args: Args
        })
    }
    _reduce(state, path, method, args) {
        if (!path || !path.length){
            // method on this;
            return this[method](state, ...args);
        } else {
            let name = path.shift();
            let sub = this[name];
            return {
                ...state,
                [name]: sub._reduce(state[name], path, method, args)
            }
        }
    }
    reduce(state, action){
        if (action.type==='REDUX_VM_DISPATCH'){
            return this._reduce(state, [...action.path], action.method, action.args);
        } else {
            return state;
        }
    }
}
