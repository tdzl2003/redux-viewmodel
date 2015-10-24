/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {createStore} from 'redux';

const regKey = /^\[(.*)\]$/;

function defaultGetter(state, name){
    return typeof(state)==='object' ? state[name] : undefined;
}

function defaultReduceParent(state, newValue, name){
    if (typeof(state)==='object'?(state[name] === newValue):(newValue===undefined)) {
        return state;
    }
    if (__DEV__ && state!==undefined){
        if (typeof(state) != 'object'){
            console.warn('Warning: using default reducer with a '+typeof(state)+' state, may cause data lost.');
        }
        if (state instanceof Array) {
            console.warn("Warning: using default reducer with a Array state, may cause data lost.");
        }
    }
    if (newValue === undefined ){
            // remove value from state.
        if (typeof (state) === 'object') {
            var ret = {};
            for (var k in state) {
                if (k != name) {
                    ret[k] = state[k];
                }
            }
            return ret;
        } else {
            return state;
        }
    }
    if (typeof(state) != 'object'){
        return {[name]: newValue};
    }
    return {...state, [name]: newValue}
}

function defaultGetterByKey(state, name){
    if (typeof(state)!== 'object' || !(state instanceof Array)){
        if (__DEV__ && state != undefined) {
            console.warn("Warning: using default key getter with a non-array state.");
        }
        return undefined;
    }
    let key = name.substr(1, name.length-2);
    if (state.find) {
        return state.find(v=>typeof(v) === 'object' ? v.key === key : v === key);     // Return undefined if not exists.
    }
    for (var i = 0; i < state.length; i++){
        let v = state[i];
        if (typeof(v) == 'object' ? v.key === key : v === key){
            return v;
        }
    }
}

function defaultReduceParentByKey(state, newValue, name){
    if (!(state instanceof Array)){
        if (__DEV__ && state !== undefined){
            console.warn("Warning: using default key reducer with a non-array state. May cause data lost.");
        }
        return [newValue];
    }
    if (newValue === undefined){
        // Remove the item.
        return state.filter(v=>{
            return typeof(v) == 'object'?v.key !== key : v !== key
        })
    }
    let key = name.substr(1, name.length-2);
    var mark = false, same = false;
    var ret = state.map(v=>{
        if (typeof(v) == 'object'?v.key === key : v === key){
            mark = true;
            if (v === newValue){
                same = true;
            }
            return newValue;
        }
        return v;
    })
    if (same){
        return state;
    }
    if (!mark){
        ret.push(newValue);
    }
    return ret;
}

export default class ViewModel
{
    constructor(parent, name, getter, reducer){
        if (parent) {
            // sub view model
            this._parent = parent;
            //this._name = name;
            this._path = [...(parent._path), name];
            this._store = parent._store;
            this._getter = getter;
            this._reduceParent = reducer;
        } else {
            // root view model.
            this._path = [];
            this._store = createStore((state, action)=> {
                return this.reduce(state, action);
            }, (this.constructor).defaultState)
        }
    }
    static get defaultState(){
        return undefined;
    }
    getSubViewModelClass(name){
        return ViewModel;
    }
    getItemClass(key){
        return ViewModel;
    }
    get name(){
        return this._path[this._path.length-1];
    }
    get key(){
        let name = this.name;
        if (name[0] == '['){
            return name.substr(1, name.length-2);
        }
    }
    get store(){
        return this._store;
    }
    get path(){
        return this._path;
    }
    get state(){
        if (!this._parent) {
            return this._store.getState();
        }
        return this._getter(this._parent.state, this.name);
    }
    getSubViewModel(name, clazz, getter, reduceParent){
        if (name[0] == '['){
            return this.getItemByKey(name.substr(1, name.length-2), clazz, getter, reduceParent);
        } else {
            clazz = clazz || this.getSubViewModelClass(name);
            return new clazz(this, name, getter || defaultGetter, reduceParent || defaultReduceParent);
        }
    }
    getItemByKey(key, clazz, getter, reduceParent){
        clazz = clazz || this.getItemClass(key);
        return new clazz(this, '['+key+']', getter || defaultGetterByKey, reduceParent || defaultReduceParentByKey);
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
            let sub;
            if (name[0] == '[') {
                sub = this.getItemByKey(name.substr(1, name.length-2));
            } else {
                sub = this[name] || this.getSubViewModel(name);
            }
            return sub._reduceParent(state, sub._reduce(sub._getter(state, name), path, method, args), name);
        }
    }
    reduce(state, action){
        if (this.path.length !== 0){
            throw new Error("Do not call reduce directly! use dispatch instead.");
        }
        if (action.type==='REDUX_VM_DISPATCH'){
            return this._reduce(state, [...action.path], action.method, action.args);
        } else {
            return state;
        }
    }
}
