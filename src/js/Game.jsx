/**
 * Created by Carlos on 03/09/2016.
 */
import React from 'react';
import * as actions from './ReduxActions';
import * as functions from './functions';
import * as configs from './constants';
import MediaQuery from 'react-responsive';



class PlayersGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let maxFlagCapturesCount = this.__getMaxValue(this.props.players, "flagCaptures");
        let maxFlagReturnsCount = this.__getMaxValue(this.props.players, "flagReturns");
        this.setState({
            maxFlagCapturesCount: maxFlagCapturesCount,
            maxFlagReturnsCount: maxFlagReturnsCount,
            hovered: ""
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeGame != nextProps.activeGame) {
            let maxFlagCapturesCount = this.__getMaxValue(nextProps.players, "flagCaptures");
            let maxFlagReturnsCount = this.__getMaxValue(nextProps.players, "flagReturns");
            this.setState({
                maxFlagCapturesCount: maxFlagCapturesCount,
                maxFlagReturnsCount: maxFlagReturnsCount
            });
        }
    }

    componentDidMount() {
        this.setState({
            orderBy: this.props.orderBy
        });
    }


    __getSymbolBlock(symbol, count, isGold) {
        return (<span className="bit thin-wrap">
                    <span className={symbol + " icon " + ((isGold) ? "text-color-gold" : "")}/>
                    <span>x</span>
                    <span>{count}</span>
                </span>);
    }

    __getBlocks(blocks) {
        let blocksStruct = [];
        for (let key of Object.keys(blocks)) {
            blocksStruct.push(
                <span className="bit" key={key}>
                    <span>{key}</span>
                    <span>{" x "}</span>
                    <span>{blocks[key]}</span>
                </span>
            );
        }
        return blocksStruct;
    }

    __getMaxValue(players, fieldName) {
        let maxValue = 0;
        for (let player of Object.entries(players)) {
            if (maxValue < player[1][fieldName]) {
                maxValue = player[1][fieldName];
            }
        }
        return maxValue;
    }

    __getSortHeaderStyle(headerName, currentSortHeaderName, isDesc) {
        if (headerName == currentSortHeaderName) {
            return ((isDesc) ? "desc" : "asc");
        } else {
            return "";
        }
    }

    __setSort(column, desc) {
        this.props.store.dispatch(actions.setOrderByGame(column, desc));
    }

    __onHover(name) {
        this.setState({
            hovered: name
        });
    }

    render() {
        let playerGridLines = [];
        let store = this.props.store.getState();
        let orderColumn = store.gameOrderField;
        let orderDesc = store.gameOrderDesc;

        for (let key of Object.keys(this.props.players)) {
            let currentPlayer = this.props.players[key];
            let isMaxFlagCaptures = (currentPlayer.flagCaptures === this.state.maxFlagCapturesCount);
            let isMaxFlagReturns = (currentPlayer.flagReturns === this.state.maxFlagReturnsCount);
            playerGridLines.push(
                <tr key={currentPlayer.name + ":" + currentPlayer[orderColumn] + ":" + orderDesc}
                    onMouseEnter={() => {
                        this.__onHover(currentPlayer.name)
                    }}
                    onMouseLeave={() => {
                        this.__onHover("")
                    }}
                    className={(currentPlayer.name == this.state.hovered) ? " text-color-highlighted " : ""}>
                    <td className="game__column-player">
                        <span className="player-name">
                            {currentPlayer.name}
                        </span>
                        <MediaQuery minWidth={configs.MIN_PC_SCREEN_WIDTH}>
                             <span>
                                {(currentPlayer.flagCaptures > 0) ? this.__getSymbolBlock("icon--flag-black", currentPlayer.flagCaptures, isMaxFlagCaptures) : ""}
                            </span>
                            <span>
                                {(currentPlayer.flagReturns > 0) ? this.__getSymbolBlock("icon--shield-cross", currentPlayer.flagReturns, isMaxFlagReturns) : ""}
                            </span>
                        </MediaQuery>
                    </td>
                    <td>
                        {currentPlayer.deaths}
                    </td>
                    <td>
                        {currentPlayer.kills}
                    </td>
                    <td>
                        {2 * functions.getRatio(currentPlayer)}
                    </td>
                    <td>
                        {currentPlayer.score}
                    </td>
                    <td className="weapons-col">
                        {this.__getBlocks(currentPlayer.weapons)}
                    </td>
                </tr>
            );
        }
        playerGridLines.sort(functions.orderByNumber);

        return (
            <table className="players-table">
                <thead>
                <tr>
                    <th className="game__column-player"><span>Name</span></th>
                    <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("deaths", orderDesc)
                        }}
                              className={this.__getSortHeaderStyle("deaths", orderColumn, orderDesc)}
                        >Deaths</span>
                    </th>
                    <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("kills", orderDesc)
                        }}
                              className={this.__getSortHeaderStyle("kills", orderColumn, orderDesc)}
                        >Kills</span>
                    </th>
                    <th>
                        <span title="Kills / (Kills + Deaths)">Ratio</span>
                    </th>
                    <th className="th__clickable">
                        <span onClick={() => {
                            this.__setSort("score", orderDesc)
                        }}
                              className={this.__getSortHeaderStyle("score", orderColumn, orderDesc)}
                        >Score</span>
                    </th>
                    <th className="weapons-col"><span>Weapons</span></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={6}>
                        <div className="mui-divider"></div>
                    </td>
                </tr>
                {playerGridLines}
                </tbody>
            </table>)
    }
}

export default class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="game-details"> {/*details*/}
                    <span className="game-grid-title">GAME:</span>
                    <span>{this.props.game.gameType}</span>
                </div>
                <div className="game-details">
                    <span className="game-grid-title">RESULT:</span>
                    <span>{this.props.game.gameResult}</span>
                </div>
                <div className="game-details">
                    <span className="game-grid-title">LENGTH:</span>
                    <span>{this.props.game.gameLength + " (" + this.props.game.gameEndReason + ")"}</span>
                </div>
                <div> {/*table*/}
                    <PlayersGrid players={this.props.game.players} store={this.props.store}
                                 activeGame={this.props.store.getState().activeGame}/>
                </div>
            </div>)
    }
}
