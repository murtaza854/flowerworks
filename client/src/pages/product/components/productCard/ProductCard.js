import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Heading1, ParaText, Button } from '../../../../components';
import api from '../../../../api';
import CartContext from '../../../../share';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import { RadioGroup, Radio, FormControlLabel } from '@mui/material';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './ProductCard.scss';

function ProductCard(props) {
    const { product } = useParams();
    const cart = useContext(CartContext);
    const theme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#000000',
            },
            secondary: {
                main: '#000000',
            },
        },
        typography: {
            fontFamily: 'Raleway',
        },
    });

    const [item, setItem] = useState({ name: '', image: '', slug: '', description: '', sizes: [], options: [], addons: [] });
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [discountedClass, setDiscountedClass] = useState('');

    const [buttonText, setButtonText] = useState({ text: 'Shop it', classes1: '' });

    const [sizePrice, setSizePrice] = useState(0);

    const [sizeRadio, setSizeRadio] = React.useState(null);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/product/getProduct?slug=${product}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    withCredentials: true,
                });
                const content = await response.json();
                const coupons = content.coupons;
                let coupon = null;
                for (let i = 0; i < coupons.length; i++) {
                    const couponFromArray = coupons[i];
                    if (couponFromArray.redeemBy && new Date(couponFromArray.redeemBy) >= new Date()) {
                        coupon = couponFromArray;
                        break;
                    }
                }
                if (!coupon && coupons.length > 0) coupon = coupons[0];
                setSelectedCoupon(coupon);
                if (content.data) {
                    const { name, image, slug, description, sizes } = content.data;
                    setItem({
                        name,
                        image,
                        price: 0,
                        slug,
                        description,
                        sizes: sizes.map(size => ({
                            name: size.name,
                            price: size.price,
                        })),
                    });
                    setSizeRadio(sizes[0].name);
                    setSizePrice(sizes[0].price);
                }
            })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    useEffect(() => {
        if (selectedCoupon) {
            let flag = true;
            if (selectedCoupon.redeemBy && new Date(selectedCoupon.redeemBy) < new Date()) flag = false;
            if (selectedCoupon.maxRedemptions && selectedCoupon.maxRedemptions <= selectedCoupon.timesRedeeemed) flag = false;
            if (flag && !selectedCoupon.hasPromotionCodes) {
                if (selectedCoupon.appliedToProducts && selectedCoupon.products.map((prod) => prod.slug).includes(item.slug)) {
                    if (selectedCoupon.type === 'Fixed Amount Discount') {
                        setDiscountedPrice(sizePrice - selectedCoupon.amountOff);
                    } else {
                        setDiscountedPrice(sizePrice - (sizePrice * (selectedCoupon.percentOff / 100)));
                    }
                    setDiscountedClass(flag ? 'discounted' : '');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCoupon, sizePrice]);

    const handleSizeChange = (event) => {
        setSizeRadio(event.target.value);
        const size = item.sizes.find(size => size.name === event.target.value);
        setSizePrice(size.price);
    };

    const onClick = async event => {
        event.preventDefault();
        const size = item.sizes.find(size => size.name === sizeRadio);
        setButtonText({ text: 'Added', classes1: 'disabled' });
        const response = await fetch(`${api}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify({
                name: item.name,
                productSlug: item.slug,
                description: item.description,
                image: item.image,
                size: size,
                type: 'product'
            })
        });
        const content = await response.json();
        cart.setCart(content.data);
        setTimeout(() => {
            setButtonText({ text: 'Shop it', classes1: '' });
        }, 1500);
    }

    return (
        <Container className="product-card">
            <Row className="justify-content-center">
                <Col className="product-image" lg={4}>
                    <img className='vertical-center-relative' src={item.image} alt={item.name} />
                </Col>
                <Col lg={7} className="product-col">
                    <div className="product-heading">
                        <Heading1
                            bold={item.name}
                            classes="text-uppercase"
                        />
                    </div>
                    <div className="product-price">
                        <Heading1
                            bold={`PKR.${sizePrice}`}
                            classes={`text-uppercase ${discountedClass}`}
                        />
                        {
                            discountedPrice !== null ? (
                                <Heading1
                                    discountAvailable={`PKR.${discountedPrice}`}
                                    classes="text-uppercase"
                                />
                            ) : null
                        }
                    </div>
                    <div className="product-text">
                        <ParaText
                            text="Description:"
                            classes="bold margin-bottom-0"
                            href="/"
                        />
                        <ParaText
                            text={item.description}
                            href="/"
                        />
                        <ParaText
                            text="Sizes:"
                            classes="bold margin-bottom-0"
                            href="/"
                        />
                        <ThemeProvider theme={theme}>
                            <RadioGroup aria-label="months" name="months" value={sizeRadio} onChange={handleSizeChange}>
                                <ul>
                                    {item.sizes.map((value, index) => {
                                        return (
                                            <li key={index}>
                                                <FormControlLabel
                                                    value={value.name}
                                                    control={
                                                        <Radio
                                                            disableRipple={true}
                                                            icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="medium" />}
                                                            checkedIcon={<CheckBoxOutlinedIcon fontSize="medium" />} />
                                                    }
                                                    label={value.name}
                                                    style={{ textTransform: 'capitalize' }}
                                                />
                                            </li>
                                        );
                                    })}
                                </ul>
                            </RadioGroup>
                        </ThemeProvider>
                        {/* {
                            item.options.length > 0 && (
                                <>
                                    <ParaText
                                        text="Options:"
                                        classes="bold margin-bottom-0"
                                        href="/"
                                    />
                                    <ThemeProvider theme={theme}>
                                        <RadioGroup aria-label="months" name="months" value={optionRadio} onChange={handleOptionChange}>
                                            <ul>
                                                {item.options.map((value, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <FormControlLabel
                                                                value={value.name}
                                                                control={
                                                                    <Radio
                                                                        disableRipple={true}
                                                                        icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="medium" />}
                                                                        checkedIcon={<CheckBoxOutlinedIcon fontSize="medium" />} />
                                                                }
                                                                label={value.name}
                                                                style={{ textTransform: 'capitalize' }}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </RadioGroup>
                                    </ThemeProvider>
                                </>
                            )
                        }
                        {
                            item.addons.length > 0 && (
                                <>
                                    <ParaText
                                        text="Addons:"
                                        classes="bold margin-bottom-0"
                                        href="/"
                                    />
                                    <ThemeProvider theme={theme}><ul className={props.classes}>
                                        {item.addons.map((value, index) => {
                                            return (
                                                <li key={index}>
                                                    <FormControlLabel
                                                        onChange={() => handleAddonsChange(index)}
                                                        value={value.name}
                                                        checked={value.checked}
                                                        control={
                                                            <Checkbox
                                                                disableRipple={true}
                                                                icon={<CheckBoxOutlineBlankOutlinedIcon fontSize="medium" />}
                                                                checkedIcon={<CheckBoxOutlinedIcon fontSize="medium" />} />
                                                        }
                                                        label={value.name}
                                                        style={{ textTransform: 'capitalize' }}
                                                    />
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    </ThemeProvider>
                                </>
                            )
                        } */}
                    </div>
                    <div className="product-button">
                        <Button to="/" onClick={onClick} text={buttonText.text} classes="text-uppercase" classes1={`btn-center-991 ${buttonText.classes1}`} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductCard;