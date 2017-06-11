import React from 'react';
import MediaQuery from 'react-responsive';
import * as actions from './ReduxActions';
import * as configs from './constants';
import GameButton from './GameButton.jsx';
import GameList from './GameList.jsx';
import GameDetails from './GameDetails.jsx';
import TeamsPie from './TeamsPie.jsx';
import TeamsTable from './TeamsTable.jsx';
import Perf from 'react-addons-perf'; // ES6

export default class ContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.store.subscribe(this._reduxStoreChanged.bind(this));

        this.state = {
            storeState: this.props.store.getState()
        };
    }

    _reduxStoreChanged() {
        // console.log("Store changed");
        this.setState({storeState: this.props.store.getState()});
    }

    componentWillMount() {
        // Perf.start()
        // console.log("ContentPage componentWillMount  ." + this);
    }

    componentDidMount() {
// /        let measurements = Perf.getLastMeasurements();
//         Perf.printWasted(measurements);
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
            <content-page className="center-container flex-columns">
                <MediaQuery minDeviceWidth={configs.MIN_PC_SCREEN_WIDTH}>
                    <div className="pane flex-rows center-top-container">
                        <div className="generator-pane">
                            <div className="teams-container">
                                <TeamsTable className="redteam"
                                            hslaColor={configs.RED_HSLA}
                                            summaryPlayers={storeState.players}
                                            teamPlayerKeys={storeState.teams[configs.RED]}/>
                                <TeamsPie columns={storeState.columns}/>
                                <TeamsTable className="blueteam"
                                            hslaColor={configs.BLUE_HSLA}
                                            summaryPlayers={storeState.players}
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
            </content-page>);
    }
}



