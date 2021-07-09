import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Button.scss';
import api from '../../api';
import CartContext from '../../share';

function Button(props) {
    const cart = useContext(CartContext);
    const history = useHistory();
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
                props.setActiveCompClass({1: 'hide', 2: '', 3: 'hide'});
            } else if (props.cartForm === 3 && props.canSubmit === true) {
                props.setActive({1: "circle", 2: "circle", 3: "circle active"});
                props.setActiveCompClass({1: 'hide', 2: 'hide', 3: ''});
            } else if (props.cartForm === 3 && props.canSubmit === false) alert('Fill delivery form.')
            else if (props.cartForm === 4) {
                const response = await fetch(`${api}/orders/confirmOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                    body: JSON.stringify({
                        firstName: props.firstName,
                        lastName: props.lastName,
                        phoneNumber: props.phoneNumber,
                        email: props.email,
                        firstName1: props.firstName1,
                        lastName1: props.lastName1,
                        phoneNumber1: props.phoneNumber1,
                        email1: props.email1,
                        area: props.area,
                        addressLine1: props.addressLine1,
                        landmark: props.landmark,
                        addressLine2: props.addressLine2,
                        date: props.date,
                        message: props.message,
                        checkBoxes: props.checkBoxes,
                        radioBoxes: props.radioBoxes,
                    })
                });
                const content = await response.json();
                if (content.data === 'success') history.push('/thankyou');
                else history.push('/');
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