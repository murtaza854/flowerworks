import React from 'react';
import { Divider, Typography, makeStyles } from '@material-ui/core';
import { Container, Col, Row } from 'react-bootstrap';
import { userDataObj, baseObj, productObj, addonObj, colorObj, sizeObj, flowerObj, areaObj, discountObj } from '../../db';
import { useParams } from 'react-router';
import './AdminForm.scss';

const useStyles = makeStyles((theme) => ({
    title: {
        flex: '1 1 100%',
        marginBottom: 10
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
        marginBottom: 15
      },
    highlight: {
        color: '#c31200'
    },
    marginTopAll: {
        marginTop: 15
    },
    delete: {
        backgroundColor: '#c31200',
        color: 'white',
        marginRight: 15,
        '&:hover': {
            background: 'black',
         },
      },
      formControl: {
          width: '100%',
      },
      rowGap: {
        marginBottom: 15
      },
      button: {
          marginRight: 15
      },
      image: {
        width: '100%',
        marginBottom: 30
      },
}));

function AdminForm(props) {
    const { model, id } = useParams();
    const classes = useStyles();

    let formFetch = {};
    if (model === 'users') formFetch = userDataObj;
    else if (model === 'bases') formFetch = baseObj;
    else if (model === 'products') formFetch = productObj;
    else if (model === 'addons') formFetch = addonObj;
    else if (model === 'colors') formFetch = colorObj;
    else if (model === 'sizes') formFetch = sizeObj;
    else if (model === 'flowers') formFetch = flowerObj;
    else if (model === 'areas') formFetch = areaObj;
    else if (model === 'discounts') formFetch = discountObj;

    return (
        <Container fluid className='adminForm'>
            <Row>
                <Col>
                <Typography className={classes.title} variant="h3">
                    {formFetch.modelName}
                <Divider />
                </Typography>
                </Col>
            </Row>
            <Row>
                <Col>{formFetch.Form(id, classes)}</Col>
                <Col></Col>
            </Row>
        </Container>
    );
}

export default AdminForm;