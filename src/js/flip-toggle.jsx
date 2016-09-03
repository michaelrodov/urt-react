/**
 * Created by Carlos on 03/09/2016.
 */
import React from 'react';

class FlipToggleSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.value
        };
    }

    switchClicked() {
        this.setState({
            checked: this.refs.teamcheckbox.checked ? "on" : "off"
        });
    }

    labelClicked() {
        this.refs.teamcheckbox.checked = !this.refs.teamcheckbox.checked;
        this.setState({
            checked: this.refs.teamcheckbox.checked ? "on" : "off"
        });
    }

    render() {

        var onStyle = {
            backgroundColor: this.props.posColor
        };
        var offStyle = {
            backgroundColor: this.props.negColor
        };
        let flippingClass = "flipping-element " + this.state.checked;
        return (
            <div className="flip-toggle">
                <div className={flippingClass}>
                    <div className="label flipped" style={offStyle} onClick={this.labelClicked.bind(this)}>
                        {this.props.negLabel}
                    </div>
                    <div className="label" style={onStyle} onClick={this.labelClicked.bind(this)}>
                        {this.props.posLabel}
                    </div>
                    <input className="control-button" type="checkbox" ref="teamcheckbox"
                           onChange={this.switchClicked.bind(this)}/>
                </div>
            </div>)
    }
}
