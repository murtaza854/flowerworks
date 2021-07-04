import React from 'react';
// import { Col } from 'react-bootstrap';
import './Card.scss'

function Card(props) {
    return (
        <div>
            <div className="cat-card">
                <img src={props.src} alt={props.alt} />
                <div className="middle">
                    <div className={props.classes}>
                        {props.button}
                        <div className={props.classes1}></div>
                        {props.button1}
                    </div>
                </div>
            </div>
            <div className="price">{props.price}</div>
        </div>
    );
}

export default Card;