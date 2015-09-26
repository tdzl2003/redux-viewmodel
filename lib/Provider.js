/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import React from 'react';

export default class Provider extends React.Component{
    constructor(props){
        super({});
        this._viewModel = props.viewModel;
        this._viewClass = props.viewClass;
        this._viewFactory = props.viewFactory;

        this.state = {
            state: this._viewModel.state
        };
    }
    componentWillMount(){
        if (this._unsubscribe){
            this._unsubscribe();
            this._unsubscribe = undefined;
        }
        this._unsubscribe = this._viewModel.store.subscribe(()=>{
            if (this._viewModel.state != this.state.state) {
                this.setState({
                    state: this._viewModel.state
                })
            }
        });
    }
    componentWillUnmount(){
        if (this._unsubscribe){
            this._unsubscribe();
            this._unsubscribe = undefined;
        }
    }
    render(){
        if (this._viewFactory){
            return this._viewFactory( this.state.state, this._viewModel );
        }
        let Class = this._viewClass;
        return (<Class {...this.state.state} context={this._viewModel}>{this.props.children}</Class>);
    }
}
