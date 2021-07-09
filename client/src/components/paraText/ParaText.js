import React from 'react';
import './ParaText.scss'

function ParaText(props) {
    return (
        <p className={`para-text ${props.classes}`} style={{textAlign: props.textAlign}}>
            {props.text} <a target={props.target} rel={props.rel} href={props.href}>{props.link}</a>
        </p>
    );
}

export default ParaText;