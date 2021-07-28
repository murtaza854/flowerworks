import React from 'react';
import { Link } from 'react-router-dom';
import './ParaText.scss'

function ParaText(props) {
    return (
        <p className={`para-text ${props.classes}`} style={{textAlign: props.textAlign}}>
            <strong>{props.bold}</strong> {props.text} <Link target={props.target} rel={props.rel} to={props.href}>{props.link}</Link>
        </p>
    );
}

export default ParaText;