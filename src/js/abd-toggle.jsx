/*
 Pure CSS3 Toggle Switch
 Abid Din - http://craftedpixelz.co.uk
 @craftedpixelz
 Design based on - http://pxlz.me/3E
 */
/**
 * Created by Carlos on 03/09/2016.
 */
//TODO add CSS inline so the module would be exportable
import React from 'react';
import * as actions from './ReduxActions';

export default class AbdToggleSwitch extends React.Component {
    constructor(props) {
        super(props);
    }


    /***
     * Run first
     */
    onChange() {
        this.switchClicked();
        this.props.store.dispatch(actions.buildTeams());
    }

    /**
     * Launch storage change
     */
    switchClicked() {
        if (this.props.active) {
            this.props.store.dispatch(actions.excludePlayer(this.props.player.name));
        } else {
            this.props.store.dispatch(actions.includePlayer(this.props.player.name));
        }
    }

    render() {
        return (
            <div className="abd-toggle">
                <input type="checkbox" ref="teamcheckbox" checked={this.props.active} onChange={this.onChange.bind(this)}/>
                <span className="btn" />
                <span className="labels"/>
                <span className="bg"/>
            </div>)
    }
}
