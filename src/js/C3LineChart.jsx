import React from 'react';
import * as functions from './functions';
import * as Globals from './globals';

export default class C3LineChart extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    componentDidMount() {
        if (this.props.cid) {
            this.setState({
                chartObject: this.__generateChart(((this.props.column) ? this.props.column : []))
            })
        }

    }

    /***
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.column !== nextProps.column) {
            this.state.chartObject.unload().load(((nextProps.column) ? nextProps.column : []));
        }
    }

    render() {
        return (
            <div id={this.props.cid} className="ps-linechart"/>
        )
    }

    __generateChart(column) {
        return c3.generate({
            bindto: '#' + this.props.cid,
            size: {
                height: 100
            },
            axis: {
                x: {
                    type: 'category',
                    categories: this.props.x,
                    show: false
                },
                y: {
                    max: 5,
                    min: 0,
                    // max: Math.max(...column.slice(1))*2,
                    // min: 30,
                    // min: Math.min(...column.slice(1))*2,
                    show: false
                }
            },
            legend: {
                hide: 'score'
            },
            tooltip: {
                show: false
            },
            point: {
                r: 1
            },
            data: {
                columns: [column],
                type: this.props.type,
                labels: true,
                colors: {
                    score: '#99949d',
                    ratio: '#9d8692'
                }
            }
        });
    }


}