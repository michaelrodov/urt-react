import React from 'react';
import * as actions from './reduxActions';
import Button from 'muicss/lib/react/button';
import * as configs from './constants';
import * as functions from './functions';
import * as Globals from './globals';
import AbdToggleSwitch from './abd-toggle.jsx';
import Game from './game.jsx';

class GameButton extends React.Component {
    constructor(props) {
        super(props);
    }

    __onClick() {
        if (this.props.action) {
            this.props.store.dispatch(this.props.action(this.props.name));
        }
    }

    render() {
        let buttonColor = (!this.props.color) ? ((this.props.pressed) ? "danger" : "dark") : this.props.color;
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

class GamesSummary extends React.Component {
    constructor(props) {
        super(props);

    }

    __setSort(column, desc) {
        this.props.store.dispatch(actions.setOrderBySummary(column, desc));
    }

    componentDidMount() {
        this.setState({
            orderBy: this.props.orderBy
        });
    }

    render() {
        let playerGridLines = [];
        let storeState = this.props.store.getState();
        let orderColumn = storeState.summaryOrderField;
        let orderDesc = storeState.summaryOrderDesc;

        for (let playerKey in storeState.players) {
            let currentPlayer = storeState.players[playerKey];

            playerGridLines.push(
                <tr key={currentPlayer.name + ":" + currentPlayer[orderColumn] + ":" + orderDesc}
                    className={(!currentPlayer.active) ? "excluded" : ""}>
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
            playerGridLines.sort(functions.orderByNumber);
        }
        return (
            <table className={this.props.className}>
                <thead>
                <tr>
                    <th><span>Team</span></th>
                    <th><span>Name</span></th>
                    <th><span onClick={()=> {
                        this.__setSort("ratio", orderDesc)
                    }}>Ratio</span></th>
                    <th><span onClick={()=> {
                        this.__setSort("grade", orderDesc)
                    }}>Grade</span></th>
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
        let store = this.props.store;
        //TODO perhaps this need to be done in stage before render, so it won't be repeated every time
        if (storeState.gameKeys) {
            var listSize = (!this.state.gamesListExpanded) ? Math.min(configs.GAME_LIST_MIN, storeState.gameKeys.length) : storeState.gameKeys.length;

            //building an array of elements from gamekeys array
            var gamesButtonsList = [];
            storeState.gameKeys.slice(0, listSize)
                .map(function (game, inx, origArray) {
                    gamesButtonsList.push(<GameButton
                        store={store}
                        action={actions.setActiveGame}
                        key={game}
                        name={game}
                        pressed={storeState.activeGame == game}/>);
                });
        }
        return (
            <div className="games-pane">
                {gamesButtonsList}
                <GameButton key="more-games" name="..." store={this.props.store}/>
            </div>)
    }
}

class GameDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let storeState = this.props.store.getState();

        console.log("GameDetails render." + this);
        let summaryGrid = (storeState.activeGame == configs.SUMMARY_GAME) ?
            (<GamesSummary store={this.props.store}
                           className="players-table fadein"/>) :
            (<Game game={storeState.games[storeState.activeGame]}
                   store={this.props.store}
                   className="game-grid fadein"/>);

        return (
            <div className="details-pane">
                {summaryGrid}
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
            storeState: this.props.store.getState()
        };
    }

    _reduxStoreChanged() {
        console.log("Store changed");
        this.setState({storeState: this.props.store.getState()});
    }

    componentWillMount() {
        console.log("ContentPage componentWillMount  ." + this);
        //this._buildTeams();
    }

    componentDidMount() {
        console.log("ContentPage componentDidMount  ..." + this);

    }

    _buildTeams() {
        /*
         let teamBalanceObject = functions.getTeamBalance(this.props.store.getState().players);
         this.props.store.dispatch(actions.updateTeams(teamBalanceObject));
         */
        this.props.store.dispatch(actions.buildTeams());
    }


    render() {
        let storeState = this.state.storeState;
        return (//this.props.store.getState().teams[configs.RED][0]
            <div className="center-container flex-columns">
                <div className="pane flex-rows center-top-container">
                    <div className="generator-pane">
                        {/* <TeamsTable className="team"
                         teamPlayerKeys={this.state.reduxStore.getState().teams}/>*/}

                        <div className="teams-container">
                            <TeamTable className="redteam"
                                       teamPlayerKeys={storeState.teams[configs.RED]}/>
                            <TeamsPie columns={storeState.columns}/>
                            <TeamTable className="blueteam"
                                       teamPlayerKeys={storeState.teams[configs.BLUE]}/>
                        </div>
                        <div className="power-pie-controller">
                            <GameButton name="Build" color="primary" action={actions.buildTeams}
                                        store={this.props.store}/>
                            {/*<GameButton name="Copy"/>*/}
                        </div>
                    </div>

                </div>
                <div className="flex-rows center-bottom-container">
                    <GameList store={this.props.store}/>
                    <GameDetails store={this.props.store}/>
                </div>
            </div>);
    }
}

export default ContentPage;



