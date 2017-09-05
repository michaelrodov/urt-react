import React from "react";
import MediaQuery from "react-responsive";
import * as actions from "./ReduxActions";
import * as configs from "./constants";
import * as functions from "./functions";
import AbdToggleSwitch from "./AbdToggleSwitch.jsx";
import NewExternalPlayer from "./NewExternalPlayer.jsx";
import C3LineChart from "./C3LineChart.jsx";

export default class GamesSummary extends React.Component {
    constructor(props) {
        super(props);
    }

    __onHover(name) {
        this.setState({
            hovered: name
        });
    }

    __setSort(column, desc) {
        this.props.store.dispatch(actions.setOrderBySummary(column, desc));
    }

    __getSortHeaderStyle(headerName, currentSortHeaderName, isDesc) {
        if (headerName == currentSortHeaderName) {
            return ((isDesc) ? "desc" : "asc");
        } else {
            return "";
        }
    }

    componentWillMount() {
        let storeState = this.props.store.getState();

        this.setState({
            summaryOrderField: storeState.summaryOrderField,
            summaryOrderDesc: storeState.summaryOrderDesc,
            hovered: "",
            _players: storeState._players.sort(functions.orderByGrade).reverse()
        });
    }

    // is invoked before a mounted component receives new props.
    // If you need to update the state in response to prop changes (for example, to reset it),
    // you may compare this.props and nextProps and perform state transitions using this.setState() in this method.
    componentWillReceiveProps(nextProps) {
        let storeState = this.props.store.getState();
        let _players;
        if (this.state.summaryOrderField !== nextProps.store.getState().summaryOrderField) {
            if (nextProps.store.getState().summaryOrderField === "grade") {
                _players = storeState._players.sort(functions.orderByGrade);
            } else if (nextProps.store.getState().summaryOrderField === "ratio") {
                _players = storeState._players.sort(functions.orderByRatio);
            }
        } else {
            _players = storeState._players;
        }

        if (this.state.summaryOrderDesc !== nextProps.store.getState().summaryOrderDesc) {
            _players.reverse();
        }

        this.setState({
            summaryOrderField: nextProps.store.getState().summaryOrderField,
            summaryOrderDesc: nextProps.store.getState().summaryOrderDesc,
            _players: _players
        });
    }

    render() {
        let _players = this.state._players;
        let playerGridLines = [];

        let inx = 0;

        // for (let playerKey in storeState.players) {
        for (let currentPlayer of _players) {
            //let currentPlayer = storeState.players[playerKey];

            ++inx;
            playerGridLines.push(
                <tr key={currentPlayer.name + ":" + currentPlayer[this.state.summaryOrderField] + ":" + this.state.summaryOrderField}
                    onMouseEnter={() => {
                        this.__onHover(currentPlayer.name)
                    }}
                    onMouseLeave={() => {
                        this.__onHover("")
                    }}
                    className={((!currentPlayer.active) ? " excluded " : "") + ((currentPlayer.name == this.state.hovered) ? " text-color-highlighted " : "")}>

                    <MediaQuery minWidth={configs.MIN_PC_SCREEN_WIDTH}>
                        <td className="toggle">
                            <AbdToggleSwitch active={currentPlayer.active}
                                             store={this.props.store}
                                             player={currentPlayer}/>
                        </td>
                    </MediaQuery>
                    <td>
                        <div className="summary__column-player">
                            <div className="column-player-flex">
                                <MediaQuery minWidth={configs.MIN_PC_SCREEN_WIDTH}>
                                    <div className="container--player-summary-chart">
                                        <C3LineChart cid={"ps-line-chart_" + inx}
                                                     column={currentPlayer.history["ratio"]}
                                                     max={currentPlayer.history["ratio" + "-desc"][1]}
                                                     min={currentPlayer.history["ratio" + "-desc"][0]}
                                                     type="area-spline"
                                                     x={currentPlayer.history.x}/>
                                    </div>
                                </MediaQuery>
                                <div className="wrapper--player-details">
                                    <div
                                        className="player-name linear-gradient-white-transparent">{inx + ". " + currentPlayer.name}</div>
                                    <div
                                        className="player-name-games linear-gradient-white-transparent">
                                        {currentPlayer.gamesPlayed} games played
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div>{currentPlayer.ratio}</div>
                    </td>
                    <td>
                        <div>{currentPlayer.grade}</div>
                    </td>
                </tr>
            );
        }

        return (
            <div>
                <div className="container--new-player">
                    <NewExternalPlayer store={this.props.store}/>
                </div>
                <table className={this.props.className}>
                    <thead>
                    <tr>
                        <MediaQuery minWidth={configs.MIN_PC_SCREEN_WIDTH}>
                            <th>
                                <span>Team</span>
                            </th>
                        </MediaQuery>
                        <th className="summary__column-player">
                            <span>Name</span>
                        </th>
                        <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("ratio", this.state.summaryOrderDesc)
                        }}
                              className={this.__getSortHeaderStyle("ratio", this.state.summaryOrderField, this.state.summaryOrderDesc)}>Ratio
                        </span>

                        </th>
                        <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("grade", this.state.summaryOrderDesc)
                        }}
                              className={this.__getSortHeaderStyle("grade", this.state.summaryOrderField, this.state.summaryOrderDesc)}>Grade
                        </span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan={4}>
                            <div className="mui-divider"></div>
                        </td>
                    </tr>
                    {playerGridLines}
                    </tbody>
                </table>
            </div>
        )
    }
}
