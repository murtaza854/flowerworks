import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';
import api from '../../api';
import CartContext from '../../share';

function Button(props) {
    const cart = useContext(CartContext);
    const onClick = async event => {
        if (props.productSlug) {
            event.preventDefault();
            const response = await fetch(`${api}/cart/addToCart?productSlug=${props.productSlug}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
            });
            const content = await response.json();
            cart.setCart(content.data);
        } else if (props.addonSlug) {
            event.preventDefault();
            const response = await fetch(`${api}/cart/addToCart?addonSlug=${props.addonSlug}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                withCredentials: true,
            });
            const content = await response.json();
            cart.setCart(content.data);
        } else if (props.cartForm) {
            event.preventDefault();
            if (props.cartForm === 2) {
                props.setActive({1: "circle", 2: "circle active", 3: "circle"});
                props.setActiveCompClass({1: 'hide', 2: ''});
            }
        }
    }
    return (
        <Link onClick={onClick} to={props.to} className={`web-button ${props.classes1}`}>
            <div className={props.classes}>
                {props.text}
            </div>
        </Link>
    );
}

export default Button;