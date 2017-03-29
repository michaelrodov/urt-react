import React from 'react';
import * as actions from './ReduxActions';
import Button from 'muicss/lib/react/button';

export default class NewExternalPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            name: "",
            score: -1,
            openInputs: false
        });
    }

    __updateName() {
        this.setState({name: this.refs.nameInput.value});
    }

    __updateScore() {
        this.setState({score: this.refs.scoreInput.value});
    }

    __buttonClicked() {
        if (this.state.openInputs) {
            if (this.state.name.length > 0 && this.state.score > -1) {
                this.setState({
                    openInputs: false
                });
                this.props.store.dispatch(actions.setOrderBySummary(this.state.player));
            }
        } else {
            this.setState({
                openInputs: true
            });
        }
    }


    render() {
        //if the form is closed, then it fades in otherwise fades out
        //let formClass = (false) ? "fadeout form--new-player-shrink" : "fadein form--new-player-grow";
        let formClass = (!this.state.openInputs) ? "fadeout form--new-player-shrink" : "fadein form--new-player-grow";
        return (
            <div className="container--external-player">
                <button className="button" onClick={this.__buttonClicked.bind(this)}/>
                <div className={formClass + " inputs"} >
                    <div className="external-name input">
                        <input placeholder="players name"
                               ref="nameInput"
                               onChange={this.__updateName.bind(this)}/>
                    </div>
                    <div className="external-score input">
                        <input placeholder="players score"
                               ref="scoreInput"
                               onChange={this.__updateScore.bind(this)}/>
                    </div>
                </div>
            </div>)
    }
}
