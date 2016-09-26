import React from 'react';
import MediaQuery from 'react-responsive';
import * as actions from './reduxActions';
import * as configs from './constants';
import GameButton from './GameButton.jsx';
import GameList from './GameList.jsx';
import GameDetails from './GameDetails.jsx';
import TeamsPie from './TeamsPie.jsx';



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