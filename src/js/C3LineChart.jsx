import React from 'react';
import * as functions from './functions';
import * as Globals from './globals';

export default class C3LineChart extends React.Component {
    constructor(props) {
        super(props);

        // this.setState({
        //     data: {
        //         line: [1, 2, 3, 1, 2, 3, 1, 2, 3]
        //     }
        // });
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    componentDidMount() {
        // Globals.powerPie = functions.generatePowerPie(this.props.columns);
        if (this.props.cid) {
            this.setState({
                chartObject: this.__generateChart()
            })

        }
    }

    /***
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     */
    componentWillReceiveProps(nextProps) {
        // functions.refreshPowerPie(this.props.columns);
        // this.state.chartObject.load();
    }

    render() {
        return (
            <div id={this.props.cid} className="ps-linechart"/>
        )
    }

    __generateChart() {
        return c3.generate({
            bindto: '#' + this.props.cid,
            axis: {
                x: {show: false},
                y: {show: false}
            },
            legend: {
                hide: 'score'
            },
            tooltip: {
              show: false
            },
            point: {
                r: 0
            },
            data: {
                columns: [
                    ['score', 5, 5, 5, 5, 5, 5]
                ],
                type: 'area-spline',
                colors: {
                    score: '#99949d'
                }
            }
        });
    }


}