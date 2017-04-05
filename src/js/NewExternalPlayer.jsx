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
            grade: -1,
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

    __buttonClicked() {
        if (this.state.openInputs && this.state.name.length > 0 && this.state.grade > -1) {
            let player = {
                name: this.state.name,
                grade: parseInt(this.state.grade),
                active: true,
                ratio: 0
            };
            this.props.store.dispatch(actions.addExternalPlayer(player));
        }

        this.setState({
            openInputs: !this.state.openInputs
        });
    }


    render() {
        //if the form is closed, then it fades in otherwise fades out
        //let formClass = (false) ? "fadeout form--new-player-shrink" : "fadein form--new-player-grow";
        let buttonAnimation = (this.state.openInputs) ? "form--new-player-grow" : "form--new-player-shrink";
        let backgroundAnimation = (this.state.openInputs) ? "fadein" : "fadeout";
        return (
            <div className="container--external-player">
                <button className={buttonAnimation + " button"}
                        onClick={this.__buttonClicked.bind(this)}/>
                <div className={backgroundAnimation + " background"}></div>
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
