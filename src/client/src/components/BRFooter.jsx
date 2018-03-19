import React from 'react';

const BRFooter = () => {

    return (
        <footer>
            <div className="connect-details footer">
                <ul className="social-networks">
        			<li>
                        <a> <img className="social-network-img" src="images/facebook.svg" alt="facebook"/></a>
                    </li>
        			<li>
                        <a><img className="social-network-img" src="images/twitter.svg" alt="twitter"/></a>
                    </li>
        		</ul>
            </div>
            <div className="terms-details footer">
                <div className="container">
        		<div className="footer-top">
        			<ul className="footer-links">
        				<li>
        					<a>Privacy Policy</a>
        				</li>
        				<li>
        					<a>Terms & Conditions</a>
        				</li>
        			</ul>
        			<ul className="footer-menu">
        				<li>
        					<a>The story</a>
        				</li>
        				<li>
        					<a>About us</a>
        				</li>
        				<li>
        					<a>Social responsibility</a>
        				</li>
        			</ul>
        		</div>
        		<div className="footer-bottom">
        			<nav className="footer-nav">
        				<ul>
        					<li>Send us <a>e-mail</a></li>
        					<li>Follow us on <a>twitter</a></li>
        					<li>Like us on  <a>facebook</a></li>
        				</ul>
        			</nav>
                    <span className="copyright">LAVENDER © 2018</span>
        		</div>
        	</div>
            </div>
        </footer>
    );
};

export default BRFooter
