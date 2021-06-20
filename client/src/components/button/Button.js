import React from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

function Button(props) {
    return (
        <Link to={props.to}>
            <div className={props.classes + ' web-button'}>
                {props.text}
            </div>
        </Link>
    );
}

export default Button;