import React from 'react';
import './Heading2.scss'

function Heading2(props) {
    return (
        <div className="heading2">
            <p className={props.classes}>
                {props.first} <span>{props.bold}</span> {props.second}
            </p>
        </div>
    );
}

export default Heading2;