import React from 'react';
import * as actions from './ReduxActions';
import * as functions from './functions';
import ga from "./GoogleAnalytics";

export default class NewExternalPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            name: null,
            grade: null,
            active: true,
            openInputs: false
        });
    }

    __updateName() {
        this.setState({name: this.refs.nameInput.value});
    }

    __updateGrade() {
        this.setState({grade: this.refs.gradeInput.value});
    }

    __isInputValid(name, grade){
            return this.state.name && this.state.grade && this.state.name.length > 0 && parseInt(this.state.grade) > -1;
    }

    __buttonClicked() {

        if (this.state.openInputs &&  this.__isInputValid(this.state.name, this.state.grade)) {
            let player = {
                name: this.state.name,
                grade: parseInt(this.state.grade),
                active: true,
                history: functions.buildHistoryArrays(null),
                ratio: 0
            };
            this.props.store.dispatch(actions.addExternalPlayer(player));
            ga.report.event(ga.tenant, "Added Player", player.name, player.grade, false);
        }

        this.setState({
            openInputs: !this.state.openInputs
        });

        ga.report.event(ga.tenant, "Clicked New Player", 0, 0, false);
    }


    render() {
        //if the form is closed, then it fades in otherwise fades out
        //let formClass = (false) ? "fadeout form--new-player-shrink" : "fadein form--new-player-grow";
        let buttonAnimation = (this.state.openInputs) ? "button--slide-right" : "button--slide-left";
        let backgroundAnimation = (this.state.openInputs) ? "fadein" : "fadeout";
        let foregrounddAnimation = (!this.state.openInputs) ? "fadein" : "fadeout";
        let inputValid = "";

        if (this.state.openInputs && this.__isInputValid(this.state.name, this.state.grade)){
            inputValid = "inputValid";
        }

        return (
            <div className="add-external-player">
                <button className={buttonAnimation + " button font-shadowed " + inputValid}
                        onClick={this.__buttonClicked.bind(this)}/>
                <div className={backgroundAnimation + " background"}></div>
                <div className={foregrounddAnimation + " foreground font-shadowed"}>Add new player</div>
                <div className={backgroundAnimation + " inputs"}>
                    <div className="external-name input">
                        <input placeholder="players name"
                               ref="nameInput"
                               type="text"
                               pattern="\S*"
                               onChange={this.__updateName.bind(this)}/>
                    </div>
                    <div className="external-score input">
                        <input placeholder="grade"
                               ref="gradeInput"
                               type="number"
                               pattern="\d*"
                               onChange={this.__updateGrade.bind(this)}/>
                    </div>
                </div>
            </div>)
    }
}
