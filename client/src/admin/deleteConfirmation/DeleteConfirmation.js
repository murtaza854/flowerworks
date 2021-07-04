import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Typography, Divider, makeStyles, Button } from '@material-ui/core';
import { Col, Container, Row } from 'react-bootstrap';
import { userDataObj, baseObj, productObj, addonObj, colorObj, sizeObj, flowerObj, areaObj } from '../../db'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


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
    tree: {
        flexGrow: 1,
        paddingTop: 15,
        paddingBottom: 15
    },
}));

function DeleteConfirmation(props) {
    const location = useLocation();
    let history = useHistory();
    const { model } = useParams();
    const classes = useStyles();

    let deleteFetch = {};
    if (model === 'users') deleteFetch = userDataObj;
    else if (model === 'bases') deleteFetch = baseObj;
    else if (model === 'products') deleteFetch = productObj;
    else if (model === 'addons') deleteFetch = addonObj;
    else if (model === 'colors') deleteFetch = colorObj;
    else if (model === 'sizes') deleteFetch = sizeObj;
    else if (model === 'flowers') deleteFetch = flowerObj;
    else if (model === 'areas') deleteFetch = areaObj;

    const [modelName, setModelName] = useState('');
    const [selected, setSelected] = useState([]);
    const [length, setLength] = useState(0);
    const [text, setText] = useState('element');
    const [text1, setText1] = useState('The element is listed below:');
    const [items, setItems] = useState([]);

    useEffect(() => {(
        async () => {
            try {
                const selected = location.state.selected;
                setModelName(location.state.modelName);
                setLength(selected.length);
                setSelected(selected)
                let query = selected.join(',');
                if (query !== '') query = `?id=${query}`;
                const response = await fetch(`${deleteFetch.deleteApi[0]}${query}`, {
                    headers: {'Content-Type': 'application/json'},
                });
                const content = await response.json();
                setItems(content.data);
            } catch (error) {
                history.push('/admin');
            }
        })();
    }, [location, deleteFetch.deleteApi, history]);

    useEffect(() => {
        if (length > 1) {
            setText('elements');
            setText1('All the elements are listed below:')
        }
    }, [length]);

    const deleteConfirmed = async e => {
        const response = await fetch(`${deleteFetch.deleteApi[1]}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ids: selected}),
        });
        const content = await response.json();
        history.push({
            pathname: `/admin/${model}`,
            state: {content: content, length: length}
        });
    }
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Typography className={classes.title} variant="h3">
                        Confirm Deletion
                        <Divider />
                    </Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Typography>
                        Are you sure you want to delete <b className={classes.highlight}>{length} {text}</b> and its dependencies (if any) of {modelName}?
                    </Typography>
                </Col>
            </Row>
            <Row className={classes.marginTopAll}>
                <Col>
                    <Typography>
                        {text1}
                    </Typography>
                </Col>
            </Row>
            <Row className={classes.marginTopAll}>
                <Col className={classes.demo}>
                <TreeView
                    className={classes.tree}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    >
                        {
                            items.map((value, index) => {
                                return <TreeItem key={index} nodeId={`${value.id}`} label={value[deleteFetch['deletePage']]}>
                                    {
                                        deleteFetch.ManyChild !== '' ? (
                                        value[deleteFetch.ManyChild].map((childValue, childIndex) => {
                                            return <TreeItem key={childIndex} nodeId={`${childValue._id}`} label={childValue.name} />
                                        })
                                        ) : null
                                    }
                                </TreeItem>
                            })
                        }
                    </TreeView>
                </Col>
            </Row>
            <Row>
                <Col>
                <Button onClick={deleteConfirmed} type="submit" variant="contained" className={classes.delete}>
                    Delete
                </Button>
                <Button onClick={_ => history.push(`/admin/${model}`)} type="submit" variant="contained" color="secondary">
                    Cancel
                </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default DeleteConfirmation;