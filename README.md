# Redux-ViewModel #

Redux-ViewModel is designed to beautify your code with [React](facebook.github.io/react/) & [Redux](http://rackt.github.io/redux/).

You don't have to write action factory and switch-cases to identity actions any more.

## Overview ##

### Counter demo: ###

```javascript
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

```

## Introduce ##

React-ViewModel make it possible to write 'ViewModel' classes to reorganize code for reducer implement in Redux.

### View-Model Class ###

View-Model class in React-ViewModel is defined as a class that contains reducer functions as methods.

In general, there should be a single 'RootViewModel' for a single app. It will hold store instance
and will be used to generate any other View-Model object in getters.

### Reducer Method ###

You can define reducer method in View-Model Class. Like reducer function in Redux, reducer method 
is method of View-Model class that receive a state and return a new state. But unlike reducer function 
in Redux, reducer method can receive any count of parameters instead of a single action parameter.

You can call `viewModel.dispatch(methodName, ...args)` to dispatch a reducer action. The method will be execute later
and the state tree will be updated.

### SubViewModel ###

ViewModel can have sub-view-models as property. Sub-view-model can be get by call `this.getSubViewModel(name, clazz)`.

Name of sub-view-model Does not need to match state field from 0.2.0. You can create alias of a sub-view-model by
implement a getter that returns a sub-view-model with different getter/reducer.

It doesn't matter that whether you cache the sub-view-model object. It doesn't store any state, instead, it store a
path from RootViewModel. If the path doesn't exists, any reducer that return a valid value will create the path.

Sub-view-model will use same store with the root one.

### ListViewModel ###

ListViewModel is view-model that operate a Array state. All item in state should be either a object with 'key' property, 
or a string/number value that mark key of itself. All actions to list should use key to identify items instead of array index.

You can also create sub-view-model alias for ListViewModel from 0.2.0. See 'Switch first' button in 'todolist' for a sample.

### Provider ###

Use redux-viewmodel with react, you should use Provider component as root component.

Provider will subscribe the store, and wrap state of root view-model as props of the real root view.

## Reference ##

### class ViewModel ###

All View-Model class should extend class ViewModel.

#### constructor() ####

Create a root view-model. A new store will be created.

#### constructor(store, path, getter, reducer) ####

Create a sub view-model. This should be called via ViewModel::getSubViewModel or ListViewModel::getItemByKey.

* store: should as same as the parent view-model.

* path: A array with path from root to this view-model.

* getter(state, name): get sub-state object from state of parent view-model.

* reduceParent(state, newValue, name): reduce state of current view-model in parent state.

#### static get defaultState() ####

Return a default State. Can be overridden. Return `undefined` if not.

#### get store() ####

Return store instance associated with the view model.

#### get state() ####

Return state data of the view model.

#### getSubViewModel(name[, clazz, [getter, reduceParent]]) ####

Create sub-view-model instance of field `name`

See description of `constructor(store, path, getter, reduceParent)` about `getter` and `reduceParent`.

#### dispatch(methodName, ...args) ####

Dispatch a reduce action. The method `methodName` will be executed and the state tree of the store will be updated.

The generated action is like this: 

```javascript
{
    "type": "REDUX_VM_DISPATCH",
    "path": [/*An array with all path splits */],
    "method": "methodName",
    args: [/*All extra arguments.*/]
}
```

#### _reduce(state, path, method, args) ####

Called before the reducer method is invoked. Path is relative to current view-model.

### class ListViewModel extends ViewModel ###

#### getItemByKey(key[, clazz, [getter, reduceParent]]) ####

Create sub-view-model instance of item with speficied `key`.

See description of `constructor(store, path, getter, reduceParent)` about `getter` and `reduceParent`.

### Provider ###

#### prop: viewModel ####

The view-model used inside the provider.

#### prop: viewClass ####

The root component class of this application.

#### prop: viewFactory (props, viewModel) ####

A function that return the root component of this application. If viewFactory is passed, viewClass will be ignored.

The root state(as props) and the root view model will be passed to viewFactory.

## F.A.Q. ##

### Can I create many root view models? ###

I think you can, but generally you will not need it.

### Can I pass view-models as prop of components? ###

Yes, you can.

### Can a view-model be associated to two or more state object? ###

No. Reducer method will called only on one sub-state. You can implement reducer function on parent view-model to do this.

### Can I create a sub-view-model alias? ###

You can since v0.2.0. You can just return another sub-view-model object(which should also be accessible), or return
a view-model class with specified `getter` and `reducer`.

See 'Switch first' button in 'todolist' for a sample.

### Can I create many providers? ###

Yes. And they can be bind to different view model created from a same root.

### Can I use redux-viewmodel with react-native? ###

Yes.

### Can I use redux-viewmodel with react-router? ###

Yes, use Provider as root of your router handler and use viewFactory to create actually views, like this:

```javascript
import {Provider} from 'redux-viewmodel';
import RootViewModel from '../viewmodels/root';

class Site extends React.Component
{
    renderContent(props, children, vm){
        return (<ul>
            {props.users.map(v=> (<li>v.name</li>))}
        </ul>);
    }
    render(){
        var children = this.props.children;
        return (<Provider
            viewFactory={
                (props, vm)=>this.renderContent(props, children, vm)
            }
            viewModel={RootViewModel.instance}
        />);
    }
}

class Users extends React.Component
{
    renderContent(props, children, vm){
        return (<div>
            {children}
        </div>);
    }
    render(){
        var children = this.props.children;
        
        return (<Provider
            viewFactory={
                (props, vm)=>this.renderContent(props, children , vm)
            }
            viewModel={RootViewModel.instance.users}
        />);
    }
}

import { Router, Route } from 'react-router';
import { createHistory } from 'history'

let history = createHistory();

$(function(){
    React.render(<Router history={history}>
        <Route path="/" component={Site}>
            <Route path="users" component={Users}>
            </Route>
        </Route>
    </Router>, document.body);
});


```