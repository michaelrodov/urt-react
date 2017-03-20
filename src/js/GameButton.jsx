import React from 'react';
import Button from 'muicss/lib/react/button';
import ga from "./GoogleAnalytics";

export default class GameButton extends React.Component {
    constructor(props) {
        super(props);
    }

    __onClick() {
        if (this.props.action) {
            ga.report.event(ga.tenant, this.props.action.name, this.props.name, 0, false);
            this.props.store.dispatch(this.props.action(this.props.name));
        }
    }

    render() {
        let buttonColor = (!this.props.color) ? ((this.props.pressed) ? "danger" : "dark") : this.props.color;
        return (
            <div className="game">
                <Button onClick={this.__onClick.bind(this)}
                        className="left-side-buttons"
                        variant="raised"
                        color={buttonColor}>
                    {this.props.name.replace("_", ". ").replace("ut4_", "")}
                </Button>
            </div>);
    }
}
