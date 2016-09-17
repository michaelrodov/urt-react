/**
 * Created by Carlos on 03/09/2016.
 */
import React from 'react';
import * as actions from './reduxActions';
import * as functions from './functions';


class PlayersGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
            orderBy: this.props.orderBy
        });
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

    __setSort(column, desc){
        this.props.store.dispatch(actions.setOrderByGame(column, desc));
    }

    render() {
        let playerGridLines = [];
        let store = this.props.store.getState();
        let orderColumn = store.gameOrderField;
        let orderDesc = store.gameOrderDesc;

        for (let key of Object.keys(this.props.players)) {
            let currentPlayer = this.props.players[key];
            playerGridLines.push(
                <tr key={currentPlayer.name+":"+currentPlayer[orderColumn]+":"+orderDesc}>
                    <td className="game__player-name">
                        {currentPlayer.name}
                    </td>
                    <td>
                        {currentPlayer.deaths}
                    </td>
                    <td>
                        {currentPlayer.kills}
                    </td>
                    <td>
                        {functions.getRatio(currentPlayer)}
                    </td>
                    <td>
                        {currentPlayer.score}
                    </td>
                    <td className="weapons-col">
                        {this.__getBlocks(currentPlayer.weapons)}
                    </td>
                </tr>
            );
        playerGridLines.sort(functions.orderByNumber);
        }

        return (
            <table className="players-table">
                <thead>
                <tr>
                    <th className="game__player-name"><span>Name</span></th>
                    <th className="th__clickable"><span onClick={()=>{this.__setSort("deaths", orderDesc)}}>Deaths</span></th>
                    <th className="th__clickable"><span onClick={()=>{this.__setSort("kills", orderDesc)}}>Kills</span></th>
                    <th className="th__clickable"><span title="Kills / (Kills + Deaths)" onClick={()=>{this.__setSort("ratio", orderDesc)}}>Ratio</span></th>
                    <th className="th__clickable"><span onClick={()=>{this.__setSort("score", orderDesc)}}>Score</span></th>
                    <th className="weapons-col"><span>Weapons</span></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={5}>
                        <div className="mui-divider"></div>
                    </td>
                </tr>
                {playerGridLines}
                </tbody>
            </table>)
    }
}

export
default
class Game extends React
    .Component {
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
                    <PlayersGrid players={this.props.game.players} store={this.props.store}/>
                </div>
            </div>)
    }
}
