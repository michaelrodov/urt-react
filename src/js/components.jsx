import React from 'react';
import * as Configs from './constants';


class Header extends React.Component {
    render() {
        return (
            <div>
                <h1>Header</h1>
            </div>
        );
    }
}

class ExpandButton extends React.Component {
    handleClick(e) {
        this.setState({gamesListExpanded: (this.state.gamesListExpanded) ? false : true});
    }

    render() {
        return (
            <button onClick={this.handleClick}
                    className="left-side-buttons mui-btn mui-btn--primary mui-btn--raised">
                ...
            </button>)
    }
}

class GameButton extends React.Component {
    handleClick(e) {
        this.setState({activeGame: this.props.name});
        console.log("button clicked");
    }

    render() {
        return (
            <div onClick={this.handleClick} className="game">
                <button onClick={this.handleClick}
                        className="left-side-buttons mui-btn mui-btn--primary mui-btn--raised">
                    this.props.name.replace("_", ". ")))
                </button>
            </div>);
    }
}

class ToggleSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: "off"
        };
    }

    switchClicked() {
        this.setState({checked: this.refs.incheckbox.checked ? "on" : "off"});
    }

    render() {
        return (
            <div className="real-toggle switch">
                <input type="checkbox" className="control-button" ref="incheckbox" onChange={this.switchClicked}/>
                <label className="toggle-body {this.state.checked}"/>
            </div>)
    }
}

class FlipToggleSwitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.value
        };
    }

    switchClicked() {
        this.setState({
            checked: this.refs.teamcheckbox.checked ? "on" : "off"
        });
    }

    labelClicked() {
        this.refs.teamcheckbox.checked = !this.refs.teamcheckbox.checked;
        this.setState({
            checked: this.refs.teamcheckbox.checked ? "on" : "off"
        });
    }

    render() {

        var onStyle = {
            backgroundColor: this.props.posColor
        };
        var offStyle = {
            backgroundColor: this.props.negColor
        };
        return (
            <div className="flip-toggle">
                <div className="flipping-element {this.state.checked}">
                    <div className="label flipped" style={offStyle} onClick={this.labelClicked}>this.props.negLabel
                    </div>
                    <div className="label" style={onStyle} onClick={this.labelClicked}>this.props.posLabel</div>
                    <input className="control-button" type="checkbox" ref="teamcheckbox" onChange={this.switchClicked}/>
                </div>
            </div>)
    }
}

class PlayersSummaryGrid extends React.Component {
    render() {


        var playerGridLines = [];

        for (var playerKey in this.props.store.getState().players) {
            var currentPlayer = this.props.store.getState().players[playerKey];

            playerGridLines.push(
                <tr key="{currentPlayer.name}">
                    <td>
                        <ToggleSwitch label="playerKey"/>
                    </td>
                    <td>
                        <FlipToggleSwitch posColor="red" posLabel="RED" negColor="blue" negLabel="BLUE" value="on"/>
                    </td>
                    <td>
                        <div className="playersColumn">
                            <div>{currentPlayer.name}</div>
                            <div>{currentPlayer.gamesPlayed} games played</div>
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
            <table className="playersTable">
                <tbody>
                <tr>
                    <th>IN</th>
                    <th>Team</th>
                    <th>Name</th>
                    <th>Ratio</th>
                    <th>Grade</th>
                </tr>
                <playerGridLines />
                </tbody>
            </table>)
    }
}

/*L2*/
class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGame: Configs.SUMMARY_GAME, //first game to display
            gamesListMax: Configs.GAME_LIST_MIN,
            gamesListExpanded: Configs.GAME_LIST_EXPANDED
        };
    }

    render() {
        console.log("GameList render." + this);
        //TODO perhaps this need to be done in stage before render, so it won't be repeated every time
        //building an array of elements from gamekeys array
        var gamesList = [];
        if (this.props.store.getState().gameKeys) {
            var listSize = (!this.state.gamesListExpanded) ? Math.min(Configs.GAME_LIST_MIN, this.props.store.getState().gameKeys.length) : this.props.store.getState().gameKeys.length;
            //var gameList = this.props.store.gameKeys.slice(0, listSize);

            gamesList = this.props.store.getState().gameKeys.slice(0, listSize)
                .map(function (game, inx, origArray) {
                    console.log("adding game: " + game);
                    return <GameButton key={game} name={game}/>
                });
        }
        return (
            <div className="pane games-pane">
                <gamesList />
                <ExpandButton />
            </div>)
    }
}

class GameDetails extends React.Component {
    render() {
        console.log("GameDetails render." + this);
        return (
            <div className="pane details-pane">
                <div>{this.props.store.getState().currentGame.name}</div>
                <PlayersSummaryGrid store={this.props.store}/>
            </div>)
    }
}

class GameGenerator extends React.Component {
    render() {
        return (
            <div className="pane generator-pane">
                <div id="power-pie-container"></div>
                <div id="power-pie-controller">
                    <GameButton name="Build Teams"/>
                    <GameButton name="Copy"/>
                </div>

            </div>)
    }
}

/*L1*/
class ContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeGame: 'SUMMARY'};
    }

    componentWillMount() {
        console.log("ContentPage componentWillMount  ." + this);
    }

    render() {
        console.log("ContentPage render ." + this);
        return (
            <div>
                <GameList store={this.props.store}/>
                <GameDetails store={this.props.store}/>
            </div>);
    }
}

export default ContentPage;



