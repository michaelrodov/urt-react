import React from 'react';
import MediaQuery from 'react-responsive';
import * as actions from './ReduxActions';
import * as configs from './constants';
import GameButton from './GameButton.jsx';
import GameList from './GameList.jsx';
import GameDetails from './GameDetails.jsx';
import TeamsPie from './TeamsPie.jsx';


//todo continue moving elements to separate JSXs
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
        return (
            <center-container className="center-container flex-columns">
                <MediaQuery minDeviceWidth={configs.MIN_PC_SCREEN_WIDTH}>
                    <div className="pane flex-rows center-top-container">
                        <div className="generator-pane">
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
                </MediaQuery>
                <div className="flex-rows center-bottom-container">
                    <GameList store={this.props.store}/>
                    <GameDetails store={this.props.store}/>
                </div>
            </center-container>);
    }
}

export default ContentPage;



