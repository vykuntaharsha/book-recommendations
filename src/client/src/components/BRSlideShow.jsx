import React, {Component} from 'react';

class BRSlideShow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideNo : 0,
            maxSlides : 3
        };
    }

    componentDidMount(){
        this.setSlides();
    }

    setSlides(){
        let slideNo = this.state.slideNo + 1;

        if(slideNo === this.state.maxSlides){
            slideNo = 0;
        }
        this.setState({ slideNo : slideNo });

        setTimeout(()=>{
            this.setSlides();
        },2000);
    }

    getDots(){
        const dots = [];

        for (let i = 0; i < this.state.maxSlides; i++) {
            if( i === this.state.slideNo ){
                dots[i] = this.getDot(i, true);
                continue;
            }
            dots[i] = this.getDot(i);
        }

        return dots;
    }

    getDot(key, active){
        if(active){
            return (<span key ={key} className="dot active"></span>);
        }
        return (<span key={key} className="dot"></span>);
    }
    getSlide( key, image , active){
        if( !active ){
            return (
                    <img key={key}
                        className="img-slides"
                        src={image}
                        alt="slide show"
                        style={{display : "none"}}
                    />
            );
        }
        return (
                <img key={key}
                    className="img-slides"
                    src={image}
                    alt="slide show"
                    style={{display : "block"}}
                />
        );
    }

    getSlides(){
        const images = ['images/slideshow1.jpg', 'images/slideshow2.jpg', 'images/slideshow3.jpg'];

        const slides = [];

        for (let i = 0; i < this.state.maxSlides; i++) {
            if( i === this.state.slideNo){
                slides[i] = this.getSlide(i, images[i], true);
                continue;
            }
            slides[i] = this.getSlide(i, images[i]);
        }
        return slides;
    }

    render(){
        return (
            <div className="slideshow-container">
                    {this.getSlides()}
                <div className="dot-container">
                    {this.getDots()}
                </div>
            </div>
        );
    }
}

export default BRSlideShow;
