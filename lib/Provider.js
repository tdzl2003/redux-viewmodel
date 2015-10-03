/**
 * Created by tdzl2_000 on 2015-09-21.
 */

import React from 'react';

export default class Provider extends React.Component{
    constructor(props){
        super({});

        this.state = {
            state: props.viewModel.state
        };
    }
    resubscribe(){
        if (this._unsubscribe){
            this._unsubscribe();
            this._unsubscribe = undefined;
        }
        this._unsubscribe = this.props.viewModel.store.subscribe(()=>{
            if (this.props.viewModel.state != this.state.state) {
                this.setState({
                    state: this.props.viewModel.state
                })
            }
        });
    }
    componentWillMount(){
        this.resubscribe();
    }
    componentDidUpdate(prevProps, prevState){
        if (prevProps.viewModel != this.props.viewModel){
            this.resubscribe();
        }
    }
    componentWillUnmount(){
        if (this._unsubscribe){
            this._unsubscribe();
            this._unsubscribe = undefined;
        }
    }
    render(){
        if (this.props.viewFactory){
            return this.props.viewFactory( this.state.state, this.props.viewModel );
        }
        let Class = this.props.viewClass;
        return (<Class {...this.state.state}>{this.props.children}</Class>);
    }
}
