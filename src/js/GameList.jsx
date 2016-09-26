import React from 'react';
import * as actions from './ReduxActions';
import * as configs from './constants';
import GameButton from './GameButton.jsx';

export default class GameList extends React.Component {
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
                {/*<GameButton key="more-games" name="..." store={this.props.store} color="grey"/>*/}
            </div>)
    }
}