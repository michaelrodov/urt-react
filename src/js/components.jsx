import React from 'react';


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
    handleClick(e){
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
    handleClick(e){
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
    getInitialState() {
        return {
            checked: "off"
        }
    }

    switchClicked() {
        this.setState({checked: this.refs.incheckbox.checked ? "on" : "off"});
    }

    render() {
        return(
        <div className="real-toggle switch">
            <input type="checkbox" className="control-button" ref="incheckbox" onChange={this.switchClicked}/>
            <label className="toggle-body {this.state.checked}" />
        </div>)
    }
}

class FlipToggleSwitch extends React.Component {
    getInitialState() {
        return {
            checked: this.props.value,
        }
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
        return(
        <div className="flip-toggle">
            <div className="flipping-element {this.state.checked}">
                <div className="label flipped" style={offStyle} onClick={this.labelClicked}>this.props.negLabel</div>
                <div className="label" style={onStyle} onClick={this.labelClicked}>this.props.posLabel</div>
                <input className="control-button" type="checkbox" ref="teamcheckbox" onChange={this.switchClicked}/>
            </div>
        </div>)
    }
}

class PlayersSummaryGrid extends React.Component {
    render() {


        var playerGridLines = [];

        for (var playerKey in this.props.players) {
            var currentPlayer = this.props.players[playerKey];

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
                        <div>{getRatio(currentPlayer)}</div>
                    </td>
                    <td>
                        <div>80</div>
                    </td>
                </tr>
            );
        }
        return(
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
    getInitialState() {
        return {
            activeGame: "SUMMARY",
            gamesListMax: 13,
            gamesListExpanded: false
        }
    }

    render() {
        console.log("GameList render." + this);
        //TODO perhaps this need to be done in stage before render, so it won't be repeated every time
        //building an array of elements from gamekeys array
        var gamesList = [];
        if (this.props.gameKeys) {
            var listSize = (!this.state.gamesListExpanded) ? Math.min(13, this.props.gameKeys.length) : this.props.gameKeys.length;
            var gameList = this.props.gameKeys.slice(0, listSize);

            gamesList = gameList.map(function (game, inx, origArray) {
                console.log("adding game: " + game);
                return <GameButton key={game} name={game}/>
            });
        }
        return(
        <div className="pane games-pane">
            <gamesList />
            <ExpandButton />
        </div>)
    }
}

class GameDetails extends React.Component {
    render() {
        console.log("GameDetails render." + this);
        return(
        <div className="pane details-pane">
            <div>{this.props.activeGame}</div>
            <PlayersSummaryGrid players={this.props.games[this.props.activeGame].players}/>
        </div>)
    }
}

class GameGenerator extends React.Component {
    render() {
        return(
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
    getInitialState() {
        return {activeGame: 'SUMMARY'};
    }

    componentWillMount() {
        console.log("ContentPage componentWillMount  ." + this);
    }

    render() {
        console.log("ContentPage render ." + this);
        return(
        <div>
            <GameList gameKeys={this.props.gameKeys} activeGame={this.state.activeGame}/>
            <GameDetails games={this.props.games} activeGame={this.state.activeGame}/>
        </div>);
    }
}

export default ContentPage;



