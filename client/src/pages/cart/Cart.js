import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Divider, Heading1 } from '../../components';
import { ProductList, DeliveryForm, Payment } from './components';
import UserContext from '../../authenticatedUser';
import './Cart.scss';

function Cart(props) {
    const [canSubmit, setCanSubmit] = useState(false);

    const user = useContext(UserContext);
    const [active, setActive] = useState({ 1: "circle active", 2: "circle", 3: "circle" });
    const [activeCompClass, setActiveCompClass] = useState({ 1: '', 2: 'hide', 3: 'hide' });

    const [firstName, setFirstName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [lastName, setLastName] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [phoneNumber, setPhoneNumber] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [email, setEmail] = useState({ value: '', errorText: '', error: false, readOnly: false });

    const [firstName1, setFirstName1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [lastName1, setLastName1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [phoneNumber1, setPhoneNumber1] = useState({ value: '', errorText: '', error: false, readOnly: false });
    const [email1, setEmail1] = useState({ value: '', errorText: '', error: false, readOnly: false });

    const [area, setArea] = useState({ value: '-', errorText: '', error: false });
    const [addressLine1, setAddressLine1] = useState({ value: '', errorText: '', error: false });
    const [landmark, setLandmark] = useState({ value: '' });
    const [addressLine2, setAddressLine2] = useState({ value: '' });

    const [date, setDate] = useState({ value: undefined, errorText: '', error: false });
    const [message, setMessage] = useState({ value: '' });

    const [checkBoxes, setCheckboxes] = useState({ receiver: false, callMe: false });

    const [radioBoxes, setRadioBoxes] = useState({ method: 'Cash on Delivery' });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [active]);

    useEffect(() => {
        let flag = true;
        // console.log(firstName)
        if (firstName.error === true) flag = false;
        else if (firstName.value === '') flag = false;
        else if (lastName.error === true) flag = false;
        else if (lastName.value === '') flag = false;
        else if (phoneNumber.error === true) flag = false;
        else if (phoneNumber.value === '') flag = false;
        else if (email.error === true) flag = false;
        else if (email.value === '') flag = false;
        else if (firstName1.error === true) flag = false;
        else if (firstName1.value === '') flag = false;
        else if (lastName1.error === true) flag = false;
        else if (lastName1.value === '') flag = false;
        else if (phoneNumber1.error === true) flag = false;
        else if (phoneNumber1.value === '') flag = false;
        else if (email1.error === true) flag = false;
        else if (email1.value === '') flag = false;
        else if (area.error === true) flag = false;
        else if (area.value === '') flag = false;
        else if (addressLine1.error === true) flag = false;
        else if (addressLine1.value === '') flag = false;
        else if (date.error === true) flag = false;
        else if (date.value === '') flag = false;
        setCanSubmit(flag);
    }, [firstName, lastName, phoneNumber, email, firstName1, lastName1, phoneNumber1, email1, area, addressLine1, date]);

    useEffect(() => {
        try {
            setFirstName({ value: user.firstName, errorText: '', error: false, readOnly: true });
            setLastName({ value: user.lastName, errorText: '', error: false, readOnly: true });
            setPhoneNumber({ value: user.contactNumber, errorText: '', error: false, readOnly: true });
            setEmail({ value: user.email, errorText: '', error: false, readOnly: true });
        } catch (error) {
            setFirstName({ value: '', errorText: '', error: false, readOnly: false });
            setLastName({ value: '', errorText: '', error: false, readOnly: false });
            setPhoneNumber({ value: '', errorText: '', error: false, readOnly: false });
            setEmail({ value: '', errorText: '', error: false, readOnly: false });
        }
    }, [user]);

    useEffect(() => {
        if (checkBoxes.receiver) {
            setFirstName1({ value: firstName.value, errorText: '', error: false, readOnly: true });
            setLastName1({ value: lastName.value, errorText: '', error: false, readOnly: true });
            setPhoneNumber1({ value: phoneNumber.value, errorText: '', error: false, readOnly: true });
            setEmail1({ value: email.value, errorText: '', error: false, readOnly: true });
        } else {
            setFirstName1({ value: '', errorText: '', error: false, readOnly: false });
            setLastName1({ value: '', errorText: '', error: false, readOnly: false });
            setPhoneNumber1({ value: '', errorText: '', error: false, readOnly: false });
            setEmail1({ value: '', errorText: '', error: false, readOnly: false });
        }
    }, [firstName, lastName, phoneNumber, email, checkBoxes.receiver]);

    const handleChange = num => {
        if (num === 1) {
            setActive({ 1: "circle active", 2: "circle", 3: "circle" });
            setActiveCompClass({ 1: '', 2: 'hide', 3: 'hide' });
        }
        else if (num === 2) {
            setActive({ 1: "circle", 2: "circle active", 3: "circle" });
            setActiveCompClass({ 1: 'hide', 2: '', 3: 'hide' });
        }
        else if (num === 3 && canSubmit === true) {
            setActive({ 1: "circle", 2: "circle", 3: "circle active" });
            setActiveCompClass({ 1: 'hide', 2: 'hide', 3: '' });
        } else if (num === 3 && canSubmit === false) alert('Fill delivery form.')
    }

    return (
        <div>
            <Container className="cart">
                <Row className="justify-content-center">
                    <Col md={1}>
                        <div onClick={_ => handleChange(1)} className={active[1] + ` center-relative`}>
                            1
                        </div>
                    </Col>
                    <Divider md={3} classes="margin-auto" />
                    <Col md={1}>
                        <div onClick={_ => handleChange(2)} className={active[2] + ` center-relative`}>
                            2
                        </div>
                    </Col>
                    <Divider md={3} classes="margin-auto" />
                    <Col md={1}>
                        <div onClick={_ => handleChange(3)} className={active[3] + ` center-relative`}>
                            3
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-center cart-heading">
                    <Col md={2}>
                        <Heading1
                            first="Your"
                            bold="Cart"
                            classes="text-uppercase text-center"
                        />
                    </Col>
                    <Col md={6}>
                        <Heading1
                            first="Delivery"
                            bold="Information"
                            classes="text-uppercase text-center"
                        />
                    </Col>
                    <Col md={2}>
                        <Heading1
                            first="Pay &"
                            bold="Send"
                            classes="text-uppercase text-center"
                        />
                    </Col>
                </Row>
            </Container>
            <div className="global-mt-2"></div>
            <Container fluid className="cart-child">
                <div className={`${active[1]} ${activeCompClass[1]}`}>
                    <ProductList setActive={setActive} setActiveCompClass={setActiveCompClass} />
                </div>
                <div className={`${active[2]} ${activeCompClass[2]}`}>
                    <DeliveryForm
                        firstName={firstName}
                        setFirstName={setFirstName}
                        lastName={lastName}
                        setLastName={setLastName}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                        email={email}
                        setEmail={setEmail}

                        firstName1={firstName1}
                        setFirstName1={setFirstName1}
                        lastName1={lastName1}
                        setLastName1={setLastName1}
                        phoneNumber1={phoneNumber1}
                        setPhoneNumber1={setPhoneNumber1}
                        email1={email1}
                        setEmail1={setEmail1}

                        area={area}
                        setArea={setArea}
                        addressLine1={addressLine1}
                        setAddressLine1={setAddressLine1}
                        landmark={landmark}
                        setLandmark={setLandmark}
                        addressLine2={addressLine2}
                        setAddressLine2={setAddressLine2}

                        date={date}
                        setDate={setDate}
                        message={message}
                        setMessage={setMessage}

                        checkBoxes={checkBoxes}
                        setCheckboxes={setCheckboxes}

                        setActive={setActive}
                        setActiveCompClass={setActiveCompClass}

                        canSubmit={canSubmit}
                    />
                </div>
                <div className={`${active[3]} ${activeCompClass[3]}`}>
                    <Payment
                        firstName={firstName.value}
                        lastName={lastName.value}
                        phoneNumber={phoneNumber.value}
                        email={email.value}

                        firstName1={firstName1.value}
                        lastName1={lastName1.value}
                        phoneNumber1={phoneNumber1.value}
                        email1={email1.value}

                        area={area.value}
                        addressLine1={addressLine1.value}
                        landmark={landmark.value}
                        addressLine2={addressLine2.value}

                        date={date.value}
                        message={message.value}

                        checkBoxes={checkBoxes}
                        
                        radioBoxes={radioBoxes}
                        setRadioBoxes={setRadioBoxes}
                    />
                </div>
            </Container>
        </div>
    );
}

export default Cart;