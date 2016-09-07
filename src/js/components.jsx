import React from 'react';
import * as actions from './reduxActions';
import Button from 'muicss/lib/react/button';
import * as configs from './constants';
import * as functions from './functions';
import * as Globals from './globals';
import AbdToggleSwitch from './abd-toggle.jsx';

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

class GameButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: (this.props.name == configs.SUMMARY_GAME)
        }
    }
    __onClick(){
        this.setState({pressed: !this.state.pressed});
        this.props.onClick();
    }

    componentDidMount(){
        this.setState({pressed: this.props.pressed});
    }

    render() {
        let buttonColor = (!this.props.color) ? ((this.state.pressed) ? "danger" : "dark") : this.props.color;
        return (
            <div className="game">
                <Button onClick={this.__onClick.bind(this)}
                        className="left-side-buttons"
                        variant="raised"
                        color={buttonColor}>
                    {this.props.name.replace("_", ". ").replace("ut4_", "")}
                </Button>
            </div>);
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
                        <AbdToggleSwitch active={currentPlayer.active} store={this.props.store} player={currentPlayer}/>
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
                    <th>Team</th>
                    <th>Name</th>
                    <th>Ratio</th>
                    <th>Grade</th>
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
        let storeState = this.props.store.getState();
        //TODO perhaps this need to be done in stage before render, so it won't be repeated every time
        if (storeState.gameKeys) {
            var listSize = (!this.state.gamesListExpanded) ? Math.min(configs.GAME_LIST_MIN, storeState.gameKeys.length) : storeState.gameKeys.length;

            //building an array of elements from gamekeys array
            var gamesButtonsList = [];
            storeState.gameKeys.slice(0, listSize)
                .map(function (game, inx, origArray) {
                    gamesButtonsList.push(<GameButton key={game} name={game} pressed={storeState.activeGame==game}/>);
                });
        }
        return (
            <div className="games-pane">
                {gamesButtonsList}
                <GameButton key="more-games" name="..."/>
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
            <div className="details-pane">
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
    componentWillReceiveProps() {
        functions.refreshPowerPie(this.props.columns);
    }

    render() {
        return (<div id="power-pie-container"></div>)
    }
}

class TeamsTable extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let redList = this.props.teamPlayerKeys[configs.RED];
        let blueList = this.props.teamPlayerKeys[configs.BLUE];
        let redStyle = {
            textAlign: 'end',
            paddingRight: '100px',
            width: '150px'
        };

        let blueStyle = {
            textAlign: 'start',
            paddingLeft: '100px',
            width: '150px'
        };

        let teams_list = [];

        for (let i = 0; i < Math.min(redList.length, blueList.length); i++) {
            let redPlayer = ((i < redList.length)) ? (<td style={redStyle}>{redList[i]}</td>) : (<td>''</td>);
            let bluePlayer = ((i < blueList.length)) ? (<td style={blueStyle}>{blueList[i]}</td>) : (<td>''</td>);

            teams_list.push(
                <tr key={i}>
                    {redPlayer}
                    {bluePlayer}
                </tr>
            );
        }

        teams_list.push(<tr key="summary">
            <td>{redList.length}</td>
            <td>{blueList.length}</td>
        </tr>);


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

class TeamTable extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let playersList = this.props.teamPlayerKeys;

        let teams_list = [];

        for (let i = 0; i < playersList.length; i++) {
            let redPlayer = (<td>{playersList[i]}</td>);

            teams_list.push(
                <tr key={i}>
                    {redPlayer}
                </tr>
            );
        }

        teams_list.push(<tr key="summary"><td>{playersList.length}</td></tr>);


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
                    <div className="generator-pane">
                       {/* <TeamsTable className="team"
                                    teamPlayerKeys={this.state.reduxStore.getState().teams}/>*/}

                        <div className="teams-container">
                            <TeamTable className="redteam" teamPlayerKeys={this.state.reduxStore.getState().teams[configs.RED]}/>
                            <TeamsPie columns={this.state.reduxStore.getState().columns} />
                            <TeamTable className="blueteam" teamPlayerKeys={this.state.reduxStore.getState().teams[configs.BLUE]}/>
                        </div>
                        <div className="power-pie-controller">
                            <GameButton name="Build" color="primary" onClick={() => this._buildTeams()}/>
                            {/*<GameButton name="Copy"/>*/}
                        </div>
                    </div>

                </div>
                <div className="flex-rows center-bottom-container">
                    <GameList store={this.state.reduxStore}/>
                    <GameDetails store={this.state.reduxStore}/>
                </div>
            </div>);
    }
}


export default ContentPage;



