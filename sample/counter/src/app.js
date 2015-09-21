/**
 * Created by tdzl2_000 on 2015-08-28.
 */

import React from 'react';
import {createStore} from 'redux';
import {ViewModel, Provider} from 'redux-viewmodel';

class CounterViewModel extends ViewModel
{
    static get defaultState(){
        return 0;
    }
    increment(state, val){
        return state + (val||1);
    }
    decrement(state, val){
        return state - (val||1);
    }
}

class RootViewModel extends ViewModel
{
    static get defaultState(){
        return {
            counter: CounterViewModel.defaultState
        }
    }
    get counter(){
        return this._counter = this._counter || this.getSubViewModel('counter', CounterViewModel);
    }
}

class NumbericView extends React.Component
{
    render(){
        return (<span>{this.props.value}</span>);
    }
}

class AppView extends React.Component
{
    render(){
        return (
            <div>
                <NumbericView value={this.props.counter}/>
                <button onClick={
                    ()=>this.props.context.counter.dispatch('increment', 1)
                 }>Inc</button>
                <button onClick={
                    ()=>this.props.context.counter.dispatch('decrement', 1)
                 }>Dec</button>
            </div>);
    }
}

var rootViewModel = new RootViewModel();

React.render((
    <Provider viewModel={rootViewModel} viewClass={AppView} />
), document.getElementById("container"));
