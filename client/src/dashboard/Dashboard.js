import React, { useContext, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import UserContext from '../authenticatedUser';
import { Profile, ChangePassword } from './components';
import './Dashboard.scss'

function Dashboard(props) {
    const user = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!user.userState) history.push('/signin');
    }, [history, user.userState])

    return (
        <Container fluid>
            <Profile />
            <div className="global-mt-2"></div>
            <ChangePassword />
        </Container>
    );
}

export default Dashboard;