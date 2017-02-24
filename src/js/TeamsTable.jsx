import React from 'react';


export default class TeamsTable extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        let playersList = this.props.teamPlayerKeys;
        let hsla = this.props.hslaColor;
        let players = this.props.summaryPlayers;
        // let style = {color: "hsla(" + hsla.h + "," + hsla.s + "," + hsla.l + "," + hsla.a + ")"};
        let teams_list = [];
        let playerLightness  = 0;
        for (let i = 0; i < playersList.length; i++) {
            let playerName = (<td>{playersList[i]}</td>);
            playerLightness = Math.min(100-players[playersList[i]].grade, 70);
            teams_list.push(
                <tr key={i}
                    style={{color: "hsla(" + hsla.h + "," + hsla.s + "%," + playerLightness + "%," + hsla.a + ")"}}>
                    {playerName}
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