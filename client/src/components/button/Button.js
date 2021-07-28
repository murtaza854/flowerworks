import React from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

function Button(props) {
    return (
        <Link onClick={props.onClick} to={props.to} className={`web-button ${props.classes1}`}>
            <div className={props.classes}>
                {props.text}
            </div>
        </Link>
    );
}

export default Button;