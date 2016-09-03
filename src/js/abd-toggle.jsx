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
import * as actions from './reduxActions';

export default class AbdToggleSwitch extends React.Component {
    constructor(props) {
        super(props);
    }

    onChange() {
        console.info("changed");
    }

    switchClicked() {
        if(this.props.status){
            actions.excludePlayer(this.props.player.name);
        }else{
            actions.includePlayer(this.props.player.name);
        }
    }

    render() {

        let inputChecked = (this.props.status) ? "checked" : "";
        return (
            <div className="abd-toggle">
                <input type="checkbox" ref="teamcheckbox" checked={inputChecked} onChange={this.onChange} />
                <span className="btn" onClick={this.switchClicked.bind(this)} />
                <span className="labels" />
                <span className="bg" />
            </div>)
    }
}
