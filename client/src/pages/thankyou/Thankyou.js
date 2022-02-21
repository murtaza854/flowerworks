import React from 'react';
import { useParams } from 'react-router-dom';
import { ParaText } from '../../components';
import './Thankyou.scss';

function Thankyou(props) {
    const { orderNumber } = useParams();

    return (
        <div className="thankyou">
            <header className="site-header" id="header">
                <h1 className="site-header__title" data-lead-id="site-header-title">THANK YOU!</h1>
            </header>
            <div className="main-content">
                <i className="fa fa-check main-content__checkmark" id="checkmark" />
                <ParaText
                    text="Your order number is: "
                    bold1={orderNumber}
                    text1="."
                    href="/"
                    textAlign="center"
                />
                <ParaText
                    text="Thankyou for your order! An email has been sent to you with your reciept. Go back"
                    link="HOME."
                    href="/"
                    textAlign="center"
                    classes=""
                />
            </div>
            <footer className="site-footer" id="footer">
                <p className="site-footer__fineprint" id="fineprint">Copyright ©2014 | All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default Thankyou;