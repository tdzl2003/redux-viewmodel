/**
 * Created by tdzl2_000 on 2015-09-21.
 */
import React from 'react';
import "./item.less";

export default class TodoItemView extends React.Component
{
    onChange(ev){
        var context = this.props.context;
        context.dispatch(ev.target.checked ? "check":"uncheck");
    }
    render(){
        var context = this.props.context;
        return (
            <li className={this.props.done ? 'done':''}>
                <input type="checkbox" checked={this.props.done} onChange={ev=>this.onChange(ev)} />
                {this.props.title}
                <button onClick={this.props.onDelete}>Delete</button>
            </li>
        )
    }
}