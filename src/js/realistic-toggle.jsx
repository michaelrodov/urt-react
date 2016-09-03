/**
 * Created by Carlos on 03/09/2016.
 */
import React from 'react';

export default class ExclusionSwitch extends React.Component {
    constructor(props) {
        super(props);
    }

    switchClicked(checked) {
        this.props.store.dispatch((checked == "on") ? actions.excludePlayer(this.props.label) : actions.includePlayer(this.props.label));
    }

    render() {
        let toggleStatus = (this.props.player.active) ? "on" : "off";
        let labelClass = "toggle-body " + toggleStatus;
        let inputClass = "control-button " + toggleStatus;
        return (
            <div className="real-toggle switch">
                <input type="checkbox" className={inputClass} ref="incheckbox" value={toggleStatus}
                       onChange={() => this.switchClicked(toggleStatus)}/>
                <label className={labelClass}/>
            </div>)
    }
}