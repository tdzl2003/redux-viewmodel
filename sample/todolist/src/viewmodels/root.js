/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import {ViewModel} from 'redux-viewmodel';
import TodoListViewModel from './todolist.js';

export default class RootViewModel extends ViewModel
{
    static get defaultState(){
        return {
            todoList: TodoListViewModel.defaultState
        }
    }
    get todoList(){
        return this._todoList = this._todoList || this.getSubViewModel('todoList', TodoListViewModel);
    }
}

