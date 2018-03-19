import React, {Component} from 'react'

class BRWelcomeUserSpan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user : props.user,
            display : true
        };
    }

    componentDidMount(){
        this.setDisplay();
    }

    setDisplay(){
        setTimeout(()=>{
            this.setState({
                display: false
            });
        }, 2000);
    }

    render(){
        if(!this.state.display) return '';
        return (
            <span className="user-welcome">
                Welcome {this.state.user.id}
            </span>
        );
    }
}

export default BRWelcomeUserSpan;
