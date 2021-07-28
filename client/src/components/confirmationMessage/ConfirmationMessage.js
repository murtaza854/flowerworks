import React, { useContext, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import api from '../../api';
import UserContext from '../../authenticatedUser';
import Heading1 from '../heading1/Heading1';
import Heading2 from '../heading2/Heading2';
import './ConfirmationMessage.scss';

function ConfirmationMessage(props) {
    const location = useLocation();
    const [line1First, setline1First] = useState('');
    const [line1Third, setline1Third] = useState('');
    const [line1Bold3, setline1Bold3] = useState('');
    const [line1Fourth, setline1Fourth] = useState('');
    const [iconClass, setIconClass] = useState('');
    const user = useContext(UserContext);
    console.log(props);

    
  useEffect(() => {
    (
      async () => {
        if (location.state && location.state.user) {
            await fetch(`${api}/users/logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                withCredentials: true,
            });
            user.setUserState(null);
            setline1First("You have successfully been logged out!");
            setline1Third("See you soon!");
            setline1Bold3('');
            setline1Fourth('');
            setIconClass('fa fa-check');
        }
        else if (location.state && location.state.success === true) {
            setline1First(location.state.line1First);
            setline1Third(location.state.line1Third);
            setline1Bold3(location.state.line1Bold3);
            setline1Fourth(location.state.line1Fourth);
            setIconClass('fa fa-check');
        } else if (location.state && location.state.success === false) {
            setline1First(location.state.line1First);
            setline1Third(location.state.line1Third);
            setline1Bold3('');
            setline1Fourth('');
            setIconClass('fa fa-times');
        } else if (props.data) {
            setline1First(props.line1First);
            setline1Third(props.line1Third);
            setline1Bold3(props.line1Bold3);
            setline1Fourth(props.line1Fourth);
            setIconClass(props.iconClass)
        } else {
            setline1First("Error performing this operation!");
            setline1Third("Please contact support if this issue persists.");
            setline1Bold3('');
            setline1Fourth('');
            setIconClass('fa fa-times');
        }
      })();
  }, [location, user, props]);

    // useEffect(() => {
    //     if (location.state && location.state.user) {
    //         await fetch(`${api}/users/logout`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             credentials: 'include',
    //             withCredentials: true,
    //         });
    //         user.setUserState(null);
    //         setline1First("You have successfully been logged out!");
    //         setline1Third("See you soon!");
    //         setline1Bold3('');
    //         setline1Fourth('');
    //         setIconClass('fa fa-check');
    //     }
    //     else if (location.state && location.state === true) {
    //         setline1First(location.state.line1First);
    //         setline1Third(location.state.line1Third);
    //         setline1Bold3(location.state.line1Bold3);
    //         setline1Fourth(location.state.line1Fourth);
    //         setIconClass('fa fa-check');
    //     } else if (location.state && location.state.success === false) {
    //         setline1First(location.state.line1First);
    //         setline1Third(location.state.line1Third);
    //         setline1Bold3('');
    //         setline1Fourth('');
    //         setIconClass('fa fa-times');
    //     } else {
    //         setline1First("Error performing this operation!");
    //         setline1Third("Please contact support if this issue persists.");
    //         setline1Bold3('');
    //         setline1Fourth('');
    //         setIconClass('fa fa-times');
    //     }
    // }, [location, user])

    return (
        <Container className="confirmation-message">
            <Row>
                <div className="global-mt-1"></div>
                <div className="icon">
                    <i className={`${iconClass} main-content__checkmark`} id="checkmark" />
                </div>
                <div className="global-mt-3" />
                <Heading1
                    first={props.first}
                    bold={props.bold}
                    second={props.second}
                    classes="text-uppercase text-center"
                />
                <div className="global-mt-3"></div>
                <Heading2
                    first={line1First}
                    link="/"
                    third={line1Third}
                    bold3={line1Bold3}
                    forth={line1Fourth}
                    classes="text-center"
                />
                <div className="global-mt-3"></div>
                <Heading2
                    first="Please click"
                    linkTag="HERE"
                    link="/"
                    second="to go back to the home page."
                    classes="text-center"
                />
                <div className="global-mt-1"></div>
            </Row>
        </Container>
    );
}

export default ConfirmationMessage;