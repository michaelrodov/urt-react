import React from 'react';
import Button from 'muicss/lib/react/button';
import * as configs from './constants';
import * as actions from './reduxActions';
import * as functions from './functions';
import * as Globals from './globals';

//TODO add prototype verification
class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Header</h1>
            </div>
        );
    }
}

class ExpandButton extends React.Component {
    constructor(props) {
        super(props);
    }

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
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="game">
                <Button onClick={this.props.onClick}
                        className="left-side-buttons"
                        variant="raised"
                        color="primary">
                    {this.props.name.replace("_", ". ").replace("ut4_", "")}
                </Button>
            </div>);
    }
}

class ExclusionSwitch extends React.Component {
    constructor(props) {
        super(props);
    }

    switchClicked(checked) {
        this.props.store.dispatch((checked == "on") ? actions.excludePlayer(this.props.label) : actions.includePlayer(this.props.label));
    }

    render() {
        let toggleStatus = (this.props.player.active) ? "on" : "off";
        let labelClass = "toggle-body " + toggleStatus;
        let inputClass = "control-button " + toggleStatus;
        return (
            <div className="real-toggle switch">
                <input type="checkbox" className={inputClass} ref="incheckbox" value={toggleStatus}
                       onChange={() => this.switchClicked(toggleStatus)}/>
                <label className={labelClass}/>
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
        let flippingClass = "flipping-element " + this.state.checked;
        return (
            <div className="flip-toggle">
                <div className={flippingClass}>
                    <div className="label flipped" style={offStyle} onClick={this.labelClicked.bind(this)}>
                        {this.props.negLabel}
                    </div>
                    <div className="label" style={onStyle} onClick={this.labelClicked.bind(this)}>
                        {this.props.posLabel}
                    </div>
                    <input className="control-button" type="checkbox" ref="teamcheckbox"
                           onChange={this.switchClicked.bind(this)}/>
                </div>
            </div>)
    }
}

class PlayersSummaryGrid extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {


        var playerGridLines = [];

        for (let playerKey in this.props.store.getState().players) {
            var currentPlayer = this.props.store.getState().players[playerKey];

            playerGridLines.push(
                <tr key={currentPlayer.name} className={(!currentPlayer.active) ? "excluded" : ""}>
                    <td>
                        <ExclusionSwitch label={playerKey} store={this.props.store} player={currentPlayer}/>
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
                <thead>
                <tr>
                    <th>IN</th>
                    <th>Team</th>
                    <th>Name</th>
                    <th>Ratio</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {playerGridLines}
                </tbody>
            </table>)
    }
}

/*L2*/
class GameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeGame: configs.SUMMARY_GAME, //first game to display
            gamesListMax: configs.GAME_LIST_MIN,
            gamesListExpanded: configs.GAME_LIST_EXPANDED
        };


    }

    render() {
        console.log("GameList render." + this);
        //TODO perhaps this need to be done in stage before render, so it won't be repeated every time
        if (this.props.store.getState().gameKeys) {
            var listSize = (!this.state.gamesListExpanded) ? Math.min(configs.GAME_LIST_MIN, this.props.store.getState().gameKeys.length) : this.props.store.getState().gameKeys.length;

            //building an array of elements from gamekeys array
            var gamesButtonsList = [];
            this.props.store.getState().gameKeys.slice(0, listSize)
                .map(function (game, inx, origArray) {
                    //console.log("adding game: " + game);
                    gamesButtonsList.push(<GameButton key={game} name={game}/>);
                });
        }
        return (
            <div className="pane games-pane">
                {gamesButtonsList}
                <ExpandButton />
            </div>)
    }
}

class GameDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("GameDetails render." + this);
        return (
            <div className="pane details-pane">
                <div>{this.props.store.getState().summary.name}</div>
                <PlayersSummaryGrid store={this.props.store}/>
            </div>)
    }
}

class TeamsPie extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    componentDidMount() {
        Globals.powerPie = functions.generatePowerPie(this.props.columns);
    }

    /***
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     */
    componentWillReceiveProps(){
        functions.refreshPowerPie(this.props.columns);
    }

    render() {
        return (<div id="power-pie-container"></div>)
    }
}
//teams double list
class TeamsTable extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let list = this.props.teamPlayerKeys;
        let teams_list = [];

        for (let i = 0; i < list.length; i++) {
            teams_list.push(
                <tr key={i}>
                    <td>{list[i]}</td>
                </tr>
            );
        }

        return (
            <div className={this.props.className}>
                <table>
                    <tbody>
                    {teams_list}
                    </tbody>
                </table>
            </div>
        )
    }
}

/*L1*/
class ContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.store.subscribe(this._reduxStoreChanged.bind(this));

        this.state = {
            activeGame: 'SUMMARY',
            reduxStore: this.props.store
        };
    }

    _reduxStoreChanged() {
        console.log("Store changed");
        this.setState({reduxStore: this.props.store});
    }

    componentWillMount() {
        console.log("ContentPage componentWillMount  ." + this);
        //this._buildTeams();
    }

    _buildTeams() {
/*
        let teamBalanceObject = functions.getTeamBalance(this.props.store.getState().players);
        this.props.store.dispatch(actions.updateTeams(teamBalanceObject));
*/
        this.props.store.dispatch(actions.buildTeams());
    }


    render() {
        return (//this.props.store.getState().teams[configs.RED][0]
            <div className="center-container flex-columns">
                <div className="pane flex-rows center-top-container">
                    <TeamsTable className="team redteam"
                                teamPlayerKeys={this.state.reduxStore.getState().teams[configs.RED]}/>
                    <div className="generator-pane">
                        <TeamsPie columns={this.state.reduxStore.getState().columns}/>
                        <div className="power-pie-controller">
                            <GameButton name="Build" onClick={() => this._buildTeams()}/>
                            {/*<GameButton name="Copy"/>*/}
                        </div>
                    </div>
                    <TeamsTable className="team blueteam"
                                teamPlayerKeys={this.state.reduxStore.getState().teams[configs.BLUE]}/>
                </div>
                <div className="pane flex-rows center-bottom-container">
                    <GameList store={this.state.reduxStore}/>
                    <GameDetails store={this.state.reduxStore}/>
                </div>
            </div>);
    }
}

export default ContentPage;



