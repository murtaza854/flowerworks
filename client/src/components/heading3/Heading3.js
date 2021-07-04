import React from 'react';
import './Heading3.scss'

function Heading3(props) {
    return (
        <div className="heading3">
            <p className={props.classes}>
                {props.first} <span>{props.bold}</span> {props.second}
            </p>
        </div>
    );
}

export default Heading3;