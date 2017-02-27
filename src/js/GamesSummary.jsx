import React from 'react';
import MediaQuery from 'react-responsive';
import * as actions from './ReduxActions';
import * as configs from './constants';
import * as functions from './functions';
import AbdToggleSwitch from './AbdToggleSwitch.jsx';

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
        this.setState({
            orderBy: this.props.orderBy,
            hovered: ""
        });
    }

    render() {
        let _players;
        let playerGridLines = [];
        let storeState = this.props.store.getState();
        let orderColumn = storeState.summaryOrderField;
        let orderDesc = storeState.summaryOrderDesc;

        if (orderColumn == "grade") {
            _players = storeState._players.sort(functions.orderByGrade);
        } else if (orderColumn == "ratio") {
            _players = storeState._players.sort(functions.orderByRatio);
        }

        if (orderDesc) {
            _players.reverse();
        }

        let inx = 0;

        // for (let playerKey in storeState.players) {
        for (let currentPlayer of _players) {
            //let currentPlayer = storeState.players[playerKey];

            ++inx;
            playerGridLines.push(
                <tr key={currentPlayer.name + ":" + currentPlayer[orderColumn] + ":" + orderDesc}
                    onMouseEnter={() => {this.__onHover(currentPlayer.name)}}
                    onMouseLeave={() => {this.__onHover("")}}
                    className={((!currentPlayer.active) ? " excluded " : "")
                        + ((currentPlayer.name == this.state.hovered) ? " text-color-highlighted " : "")}>
                    <MediaQuery minWidth={configs.MIN_PC_SCREEN_WIDTH}>
                        <td className="toggle">
                            <AbdToggleSwitch active={currentPlayer.active}
                                             store={this.props.store}
                                             player={currentPlayer}/>
                        </td>
                    </MediaQuery>
                    <td>
                        <div className="summary__column-player">
                            <div className="player-name">{inx + ". " + currentPlayer.name}</div>
                            <div className="player-name-games">{currentPlayer.gamesPlayed} games played</div>
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
                            this.__setSort("ratio", orderDesc)
                        }}
                              className={this.__getSortHeaderStyle("ratio", orderColumn, orderDesc)}>Ratio
                        </span>

                    </th>
                    <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("grade", orderDesc)
                        }}
                              className={this.__getSortHeaderStyle("grade", orderColumn, orderDesc)}>Grade
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
            </table>)
    }
}
