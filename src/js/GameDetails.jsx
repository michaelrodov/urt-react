import React from 'react';
import * as configs from './constants';
import Game from './Game.jsx';
import GamesSummary from './GamesSummary.jsx';

export default class GameDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeinClass: "fadein"
        };
    }

    componentWillUpdate(){
        // console.warn("GameDetails > componentWillUpdate");

    }
    /*Invoked when a component is receiving new props. This method is not called for the initial render*/
    componentWillReceiveProps(){
        // console.warn("GameDetails < componentWillReceiveProps");
        this.setState({fadeinClass: "fadein"})
    }
    render() {
        let storeState = this.props.store.getState();

        let summaryGrid = (storeState.activeGame == configs.SUMMARY_GAME) ?
            (<GamesSummary store={this.props.store}
                           className="players-table fadein"/>) :
            (<Game game={storeState.games[storeState.activeGame]}
                   store={this.props.store}
                   className="game-grid fadein"/>);

        return (
            <div className={"details-pane " + this.state.fadeinClass}>
                {summaryGrid}
            </div>)
    }
}