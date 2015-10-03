/**
 * Created by tdzl2_000 on 2015-09-21.
 */
import React from 'react';
import TodoItemView from './item';

export default class AppView extends React.Component
{
    addItem(){
        var context = this.props.context;
        context.todoList.dispatch("addItem", prompt("Input a title"));
    }
    switchFirst(){
        var context = this.props.context;
        context.todoList.first.dispatch("switch");
    }
    deleteItem(key){
        var context = this.props.context;
        context.todoList.dispatch("deleteItem", key);
    }
    render(){
        var context = this.props.context;
        return (
            <div>
                <button onClick={()=>this.addItem()}>Add</button>
                <button onClick={()=>this.switchFirst()}>Switch First</button>
                <ul className="todo-list">
                    {
                        this.props.todoList.map((v)=>{
                            return <TodoItemView
                                    {...v}
                                    context={context.todoList.getItemByKey(v.key)}
                                    onDelete={()=>this.deleteItem(v.key)}
                                    />
                        })
                    }
                </ul>
            </div>);
    }
}
