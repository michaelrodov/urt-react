import React from 'react';

export default class WeightChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let leftWeight = this.props.leftWeight;
        let rightWeight = this.props.rightWeight;

        let point =  Math.abs(leftWeight - rightWeight);

        return (
            <div ref="chart" className="weight-chart">
                <div id="left-scale"></div>
                <div id="legend"></div>
                <div id="right-scale"></div>
            </div>)
    }
}
