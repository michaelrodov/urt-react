import React from 'react';
import * as functions from './functions';
import * as Globals from './globals';

export default class TeamsPie extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    componentDidMount() {
        Globals.powerPie = functions.generatePowerPie(this.props.columns);
    }

    /***
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     */
    componentWillReceiveProps() {
        functions.refreshPowerPie(this.props.columns);
    }

    render() {
        return (<div id="power-pie-container"></div>)
    }
}