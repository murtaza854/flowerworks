import React from 'react';
import './Heading1.scss'

function Heading1(props) {
    return (
        <div className="heading1">
            <p className={props.classes}>
                {props.first} <span>{props.bold}</span> {props.second}
            </p>
        </div>
    );
}

export default Heading1;