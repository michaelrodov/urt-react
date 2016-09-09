/**
 * Created by Carlos on 03/09/2016.
 */
import React from 'react';
import * as actions from './reduxActions';
import * as configs from './constants';
import * as globals from './globals';


class PlayersGrid extends React.Component {
    constructor(props) {
        super(props);
    }


    __getBlocks(blocks){
        let blocksStruct = [];
        for(let key of Object.keys(blocks)){
            blocksStruct.push(
                <span key={key}>{ key + "x"+ blocks[key]}</span>
            );
        }

        return blocksStruct;
    }

    render() {


        let playerGridLines = [];

        for (let key of Object.keys(this.props.players)) {
            let currentPlayer = this.props.players[key];

            playerGridLines.push(
                <tr key={key}>
                    <td>
                        {currentPlayer.name}
                    </td>
                    <td>
                        {currentPlayer.deaths}
                    </td>
                    <td>
                        {currentPlayer.kills}
                    </td>
                    <td>
                        {currentPlayer.score}
                    </td>
                    <td>
                        {this.__getBlocks(currentPlayer.weapons)}
                    </td>
                </tr>
            );
        }

        return (
            <table className="playersTable">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Deaths</th>
                    <th>Kills</th>
                    <th>Score</th>
                    <th>Weapons</th>
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

export default class Game extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="">
                <div> {/*details*/}
                    <span>GAME:</span>
                    <span>{this.props.game.gameType}</span>
                </div>
                <div>
                    <span>RESULT:</span>
                    <span>{this.props.game.gameResult}</span>
                </div>
                <div>
                    <span>LENGTH:</span>
                    <span>{this.props.game.gameEndReason + " (" + this.props.game.gameLength + ")"}</span>
                </div>
                <div> {/*table*/}
                    <PlayersGrid players={this.props.game.players}/>
                </div>
            </div>)
    }
}
