import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Container, Row } from 'react-bootstrap';
import './AuthCheck.scss';

function AuthCheck(props) {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const oobCode = params.get('oobCode');
  const continueUrl = params.get('continueUrl') || null;
  const lang = params.get('lang') || 'en';

  const [message, setMessage] = useState('');

  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
          body: JSON.stringify({ mode: mode, oobCode: oobCode, continueUrl: continueUrl, lang: lang })
        });
        const content = await response.json();
        try {
          const message = content.data;
          setMessage(message);
        } catch (error) {
          setMessage(error);
        }
      })();
  }, [mode, oobCode, continueUrl, lang]);

  return (
    <div className="auth-check">
      <img className="bolt" src="/admin/Mzushi_Bolt.png" alt="Mzushi Bolt" />
      <Row className="justify-content-center logo">
        <img className="logo img-fluid" src="/logo.png" alt="Mzushi" />
      </Row>
      <Container fluid>
        <Row className="justify-content-center">
          <div className="message">
            {message}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default AuthCheck;