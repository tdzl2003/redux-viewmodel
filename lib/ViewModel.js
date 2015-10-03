/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {createStore} from 'redux';

export default class ViewModel
{
    constructor(store, path, getter, reducer){
        this._path = path || [];

        this._store = store || createStore((state, action)=>{
            return this.reduce(state, action);
        }, (this.constructor).defaultState);

        this._getter = getter;
        this._reduceParent = reducer;
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
        return this.getState(this._store.getState());
    }
    getState(root){
        let ret = root;
        this._path.forEach(v=>{
            ret = getSubState(ret, v);
        })
        return ret;
    }
    getSubViewModel(name, clazz, getter, reduceParent){
        clazz = clazz || ViewModel;
        return new clazz(this._store, [...this._path, name], getter || ((state, name)=>{
            return state[name];
        }), reduceParent || ((state, newValue, name)=>{
            if (state[name] == newValue){
                return state;
            }
            return {...state, [name]: newValue}
        }));
    }
    dispatch(method, ...Args){
        this._store.dispatch({
            type: 'REDUX_VM_DISPATCH',
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
            return sub._reduceParent(state, sub._reduce(sub._getter(state, name), path, method, args), name);
        }
    }
    reduce(state, action){
        if (this.path.length !== 0){
            throw new Error("Do not call reduce directly!");
        }
        if (action.type==='REDUX_VM_DISPATCH'){
            return this._reduce(state, [...action.path], action.method, action.args);
        } else {
            return state;
        }
    }
}
