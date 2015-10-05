# Redux-ViewModel #

Redux-ViewModel is designed to beautify your code with [React](facebook.github.io/react/) & [Redux](http://rackt.github.io/redux/).

You don't have to write action factory and switch-cases to identity actions any more.

## Changelog ##

### 0.3.0 ###

* Constructor arguments changed.

* ViewModel.state property works fine now.

* Parent state should not change if reducer doesn't change state. This can make view re-render less.

* Key will store in a pair of square brackets like '[key]' in path.

* ListViewModel only have different defaultState, all it's method can be accessed in ViewModel.js. You can use ViewModel even if your state is a array.

* Add method `getDefaultSubViewModelClass(name)` and `getDefaultItemClass(key)`. You can override this to provide
a default class for sub-viewmodel or item-viewmodel

* Add property `name`

* Fix Array.prototype.find on IE9

### 0.2.1 ###

* Fix a bug that provider didn't rerender when use together with react-router

* Known issue: ViewModel.state was broken now.

### 0.2.0 ###

* Add getter/reducer parameter to view model constructor, make's you can create view model alias or special view model like .first/.last

* Known issue: ViewModel.state was broken now.

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

var rootViewModel = new RootViewModel();

class AppView extends React.Component
{
    render(){
        return (
            <div>
                <NumbericView value={this.props.counter}/>
                <button onClick={
                    ()=>rootViewModel.counter.dispatch('increment', 1)
                 }>Inc</button>
                <button onClick={
                    ()=>rootViewModel.counter.dispatch('decrement', 1)
                 }>Dec</button>
            </div>);
    }
}

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

From 0.3.0, there's no different between ViewModel and ListViewModel except defaultState. You can
use ViewModel on a array state.

### Provider ###

Use redux-viewmodel with react, you should use Provider component as root component.

Provider will subscribe the store, and wrap state of root view-model as props of the real root view.

## Reference ##

### class ViewModel ###

All View-Model class should extend class ViewModel.

#### constructor() ####

Create a root view-model. A new store will be created.

#### constructor(parent, name, getter, reducer) ####

Create a sub view-model. This should be called via ViewModel::getSubViewModel or ViewModel::getItemByKey.

* parent: parent view-model.

* name: Name of this view model.

* getter(state, name): get sub-state object from state of parent view-model.

* reduceParent(state, newValue, name): reduce state of current view-model in parent state.

#### static get defaultState() ####

Return a default State. Can be overridden. Return `undefined` if not.

#### getSubViewModelClass(name) ####

Return view-model class for sub-view-model.

#### getItemClass(name) ####

Return view-model class for item.

#### get name() ####

Return name of current view-model class.

#### get key() ####

Return key of current view-model class if the view-model is a item view-model.

#### get store() ####

Return store instance associated with the view model.

#### get path() ####

Return path of current view-model.

#### get state() ####

Return state data of the view model.

#### getSubViewModel(name[, clazz, [getter, reduceParent]]) ####

Create sub-view-model instance of field `name`

See description of `constructor(parent, name, getter, reduceParent)` about `getter` and `reduceParent`.

#### getItemByKey(key[, clazz, [getter, reduceParent]]) ####

Create sub-view-model instance of item with speficied `key`.

See description of `constructor(parent, name, getter, reduceParent)` about `getter` and `reduceParent`.

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

You can override this method to do extra work.

You can also invoke this method to simulate multiple works in a reducer method.

### Provider ###

#### prop: viewModel ####

The view-model used inside the provider.

#### prop: viewClass ####

The root component class of this application.

#### prop: viewFactory (props, viewModel) ####

A function that return the root component of this application. If viewFactory is passed, viewClass will be ignored.

The root state(as props) and the root view model will be passed to viewFactory.

#### prop: children ####

Children of provider will be passed to the component directly.

## F.A.Q. ##

### Can I create many root view models? ###

I think you can, but usually you don't need to.

### Can I pass view-models as prop of components? ###

Yes, you can.

### Can a view-model be associated to two or more state object? ###

No. Reducer method will called only on one sub-state. You can implement reducer function on parent view-model to do this.

You can invoke `_reduce` method to simulate action on multiply sub-view model, like this:

```
class someListViewModel extends ListViewModel
{
    checkAll(state){
        // run 'check' on each item in a single action.
        var keys = state.map(v=>v.key)
        keys.forEach(key=>{
            state = this._reduce(state, ['['+key+']'], 'check', []);
        })
        return state;
    }
}
```

### Can I create a sub-view-model alias? ###

You can since v0.2.0. You can just return another sub-view-model object(which should also be accessible), or return
a view-model class with specified `getter` and `reducer`.

See 'Switch first' button in 'todolist' for a sample.

### Can I create many providers? ###

Yes. And they can be bind to different view model created from a same root.

### Can I use same view-model/component class in different path? ###

Yes, that's the right way to use Redux-ViewModel.

Data of same `class` may use same view-model class, even they are on different path.

For example, if we are writing a site like github, the following path with different value may have same class:

```
projects, tdzl2003/lua.js
users, tdzl2003, ownedProjects, tdzl2003/redux-viewmodel
users, tdzl2003, stars, stewartlord/identicon.js
users, tdzl2003, contributed, facebook/react-native.js
```

So they can be visited with same view-model class like `ProjectViewModel`, and be rendered with same component like 'ProjectShortInfo' or 'ProjectDetails'.

Also, you can use same view-model on different components to render/interact differently, but don't use different
view-model class with same path.

### Can I use redux-viewmodel with react-native? ###

Yes.

### Can I use redux-viewmodel with angularjs? ###

I think so, but I didn't test it.

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

It's also possible to use same provider by override createElement function of Router, like this:

```javascript
// Simple site without modify
class Site extends React.Component
{
    render(){
        return (<div>
            <NavBar/>
            {this.props.children}
            <PageFooter/>
        </div>);
    }
}

function createComponetWithProvider(Component, props){
    return (<Provider viewClass={Component}
                      viewModel={RootViewModel.instance}>
            {props.children}
        </Provider>);
}

$(function(){
    React.render(<Router history={history} createElement={createComponetWithProvider}>
        <Route path="/" component={Site}>
            <IndexRoute component={Index}/>
            <Route path="project" component={Project} />
        </Route>
    </Router>, document.body);
});

```

### Can I use redux-viewmodel with xxx or yyy or zzz? ###

I don't know. Try it yourself. Tell me what's happening if any error occured.
