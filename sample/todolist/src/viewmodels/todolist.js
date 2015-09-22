/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {ViewModel, ListViewModel} from 'redux-viewmodel';

export class TodoItemViewModel extends ViewModel
{
    check(state){
        return {
            ...state,
            done: true
        }
    }
    uncheck(state){
        let {done, ...other} = state
        return other
    }
}

export default class TodoListViewModel extends ListViewModel
{
    static get defaultState(){
        return [
            {
                key: 1,
                title: 'Foo'
            },
            {
                key: 2,
                title: 'Bar',
                done: true
            }
        ]
    }
    getItem(i){
        return getItemByKey(this.state[i]);
    }
    getItemByKey(key){
        return super.getItemByKey(key, TodoItemViewModel);
    }
    addItem(state, title){
        // Find largest id
        var id = state.map(v=>v.key).reduce((a, b)=>{return Math.max(a, b)}, 0) + 1;

        return [
            ...state,
            {
                key: id,
                title: title
            }
        ]
    }
    deleteItem(state, key){
        return this.state.filter(v=>v.key!=key);
    }
}