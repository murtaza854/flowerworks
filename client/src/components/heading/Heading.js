import React from 'react';
import './Heading.scss'

function Heading(props) {
    return (
        <div className="heading">
            <p className={props.classes}>
                {props.first} <span>{props.bold}</span> {props.second}
            </p>
        </div>
    );
}

export default Heading;