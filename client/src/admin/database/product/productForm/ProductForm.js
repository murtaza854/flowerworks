import { FormControl, InputLabel, Typography, Input, FormControlLabel, Checkbox, FormHelperText, Button, TextField, Autocomplete, Tooltip } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../../../api';


function gcd(a, b) {
    return (b === 0) ? a : gcd(b, a % b);
}

function ProductForm(props) {
    const id = useParams().id || null;

    const [name, setName] = useState({ value: '', error: false, helperText: 'Enter a name Ex. Home Sweet Home' });
    const [primaryImage, setPrimaryImage] = useState({ picturePreview: '', imgURl: '', error: false });
    const [description, setDescription] = useState({ value: '', error: false, helperText: 'Enter description Ex. This is a...' });
    const [base, setBase] = useState({ name: '', obj: null, helperText: 'Enter base Ex. Box', error: false });
    const [sizes, setSizes] = useState([
        { name: '', price: '', nameError: false, priceError: false, nameHelperText: 'Enter size label Ex. Medium', priceHelperText: 'Enter price Ex. 200' },
    ]);
    const [checkBoxes, setCheckBoxes] = useState({ active: true });
    const [primaryImageToBeDeleted, setPrimaryImageToBeDeleted] = useState('');

    const [bases, setBases] = useState([]);

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${api}/base/getAllBases`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const content = await response.json();
                if (content.data) {
                    setBases(content.data);
                }
            }
        )();
    }, []);


    useEffect(() => {
        let flag = true;
        if (name.error === true) flag = true;
        else if (name.value.length === 0) flag = true;
        else if (description.error === true) flag = true;
        else if (description.value.length === 0) flag = true;
        else if (primaryImage.imgURl === '') flag = true;
        else if (primaryImage.error === true) flag = true;
        else if (base.error === true) flag = true;
        else if (base.obj === null) flag = true;
        else flag = false;
        for (let i = 0; i < sizes.length; i++) {
            if (sizes[i].nameError === true) {
                flag = true;
                break;
            } else if (sizes[i].name.length === 0) {
                flag = true;
                break;
            } else if (sizes[i].priceError === true) {
                flag = true;
                break;
            } else if (sizes[i].price.length === 0) {
                flag = true;
                break;
            } else {
                flag = false;
            }
        }
        if (sizes.length === 0) flag = true;
        setDisabled(flag);
    }, [name, description, primaryImage, base, sizes]);

    const handleNameChange = (event) => {
        if (event.target.value.length === 0) {
            setName({ value: event.target.value, error: true, helperText: 'Name is required!' });
        } else {
            setName({ value: event.target.value, error: false, helperText: 'Enter a name Ex. Home Sweet Home' });
        }
    }

    const handleDescriptionChange = (event) => {
        if (event.target.value.length === 0) {
            setDescription({ value: event.target.value, error: true, helperText: 'Description is required!' });
        } else {
            setDescription({ value: event.target.value, error: false, helperText: 'Enter description Ex. This is a...' });
        }
    }

    const primaryImageChange = event => {
        let reader = new FileReader();
        if (event.target.files && event.target.files[0]) {
            if (event.target.files[0].size / 1024 < 300) {
                reader.readAsDataURL(event.target.files[0]);
                const objectUrl = URL.createObjectURL(event.target.files[0]);
                reader.onload = ((theFile) => {
                    var image = new Image();
                    image.src = theFile.target.result;
                    image.onload = function () {
                        const w = this.width;
                        const h = this.height;
                        const r = gcd(w, h);
                        if (w / r === h / r) {
                            setPrimaryImage(prevState => ({ ...prevState, picturePreview: event.target.files[0], imgURl: objectUrl, error: false }));
                        }
                        else {
                            alert("Please upload a square image.");
                        }
                    };
                });
            } else {
                alert("Size too large. Must be below 300kb.");
            }
        }
    }

    const handleBaseChange = (event) => {
        const obj = bases.find(base => base.name === event.target.value);
        if (event.target.value === '') {
            setBase({ name: event.target.value, obj: null, helperText: 'Base is required!', error: true });
        } else if (obj === undefined) {
            setBase({ name: event.target.value, obj: null, helperText: 'Base does not exist!', error: true });
        } else {
            setBase({ name: event.target.value, obj, helperText: 'Enter base Ex. Box', error: false });
        }
    }

    const handleSizesChange = (event, index, field) => {
        const newSizes = [...sizes];
        if (field === 'name') {
            if (event.target.value.length === 0) {
                newSizes[index] = { ...newSizes[index], name: event.target.value, nameError: true, nameHelperText: 'Name is required!' };
            } else {
                newSizes[index] = { ...newSizes[index], name: event.target.value, nameError: false, nameHelperText: 'Enter size label Ex. Medium' };
            }
        } else if (field === 'price') {
            if (event.target.value.length === 0) {
                newSizes[index] = { ...newSizes[index], price: event.target.value, priceError: true, priceHelperText: 'Price is required!' };
            } else if (isNaN(event.target.value)) {
                newSizes[index] = { ...newSizes[index], price: event.target.value, priceError: true, priceHelperText: 'Price must be a number!' };
            } else {
                newSizes[index] = { ...newSizes[index], price: event.target.value, priceError: false, priceHelperText: 'Enter price Ex. 200' };
            }
        }
        setSizes(newSizes);
    }

    const handleActiveChange = (event) => {
        setCheckBoxes({ ...checkBoxes, active: !checkBoxes.active });
    }

    const handleSubmitAdd = async event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append(
            'data',
            JSON.stringify({
                name: name.value,
                description: description.value,
                base: base.obj,
                active: checkBoxes.active,
                sizes: sizes.map(size => ({ name: size.name, price: size.price })),
            })
        )
        formData.append('image', primaryImage.picturePreview);
        const response = await fetch(`${api}/product/add`, {
            method: 'POST',
            headers: {
                'Accept': 'multipart/form-data',
                'Cache-Control': 'no-store'
            },
            body: formData,
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/product';
        } else {
            alert("Something went wrong.");
        }
    }

    const handleSubmitEdit = async event => {
        event.preventDefault();
        const formData = new FormData();
        if (primaryImage.picturePreview !== '') {
            formData.append('image', primaryImage.picturePreview);
        }
        formData.append(
            'data',
            JSON.stringify({
                id: id,
                name: name.value,
                description: description.value,
                base: base.obj,
                sizes: sizes.map(size => ({ name: size.name, price: size.price })),
                active: checkBoxes.active,
                primaryImageToBeDeleted: primaryImage.picturePreview !== '' ? primaryImageToBeDeleted : '',
            })
        );
        const response = await fetch(`${api}/product/update`, {
            method: 'POST',
            headers: {
                'Accept': 'multipart/form-data',
                'Cache-Control': 'no-store'
            },
            body: formData,
        });
        const content = await response.json();
        if (content.data) {
            window.location.href = window.location.href.split('/admin')[0] + '/admin/product';
        } else {
            alert("Something went wrong.");
        }
    }

    const handleAddSize = _ => {
        setSizes([...sizes, { name: '', price: '', nameError: false, priceError: false, nameHelperText: 'Enter size label Ex. Medium', priceHelperText: 'Enter price Ex. 200' }]);
    }

    const handleDeleteSize = index => {
        const newSizes = [];
        for (let i = 0; i < sizes.length; i++) {
            if (i !== index) {
                newSizes.push(sizes[i]);
            }
        }
        setSizes(newSizes);
    }

    useEffect(() => {
        (
            async () => {
                if (id) {
                    const response = await fetch(`${api}/product/getById`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });
                    const content = await response.json();
                    if (content.data) {
                        const { data } = content;
                        setName({ value: data.name, error: false, helperText: 'Enter a name Ex. Home Sweet Home' });
                        setPrimaryImage({ picturePreview: '', imgURl: data.image, error: false })
                        setDescription({ value: data.description, error: false, helperText: 'Enter description Ex. This is a...' });
                        setPrimaryImageToBeDeleted(data.image)
                        setBase({ name: data.base.name, obj: data.base, helperText: 'Enter base Ex. Box', error: false });
                        setCheckBoxes({ active: data.active });
                        const sizes = [];
                        data.sizes.forEach(size => {
                            sizes.push({ name: size.name, price: size.price, nameError: false, priceError: false, nameHelperText: 'Enter size label Ex. Medium', priceHelperText: 'Enter a price Ex. 200' });
                        });
                        setSizes(sizes);

                        setDisabled(false);

                    } else {
                        window.location.href = window.location.href.split('/admin')[0] + '/admin/product';
                    }
                }
            })();
    }, [id]);

    let onSubmit = handleSubmitAdd;
    if (id) onSubmit = handleSubmitEdit;

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Product
                    </Typography>
                </Col>
            </Row>
            <Form onSubmit={onSubmit}>
                <input
                    type="password"
                    autoComplete="on"
                    value=""
                    style={{ display: 'none' }}
                    readOnly={true}
                />
                <Row>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel error={name.error} htmlFor="name">Name</InputLabel>
                            <Input id="name"
                                value={name.value}
                                onChange={handleNameChange}
                                onBlur={handleNameChange}
                                error={name.error}
                            />
                            <FormHelperText error={name.error}>{name.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <Autocomplete
                                style={{ width: '100%' }}
                                disablePortal
                                value={base.obj ? base.obj.name : null}
                                onChange={handleBaseChange}
                                onBlur={handleBaseChange}
                                fullWidth
                                id="combo-box-demo"
                                options={bases.map(option => option.name)}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField error={base.error} {...params} variant="standard" label="Base" />}
                            />
                            <FormHelperText error={base.error}>{base.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControl variant="standard" fullWidth>
                            <TextField
                                id="description"
                                label="Description"
                                variant="standard"
                                value={description.value}
                                onChange={handleDescriptionChange}
                                onBlur={handleDescriptionChange}
                                error={description.error}
                                multiline
                                rows={10}
                            />
                            <FormHelperText error={description.error}>{description.helperText}</FormHelperText>
                        </FormControl>
                    </Col>
                    <Col md={6}>
                        <Row>
                            <label htmlFor="image1">
                                <Input onChange={primaryImageChange} hidden accept="image/*" id="image1" type="file" />
                                <Button type="button" variant="contained" component="span">
                                    Upload Primary Image
                                </Button>
                            </label>
                        </Row>
                        <Row>
                            {
                                primaryImage.imgURl !== '' ? (
                                    <>
                                        <div className="margin-global-top-2" />
                                        <img style={{ width: '15rem' }} src={primaryImage.imgURl} alt="Preview" />
                                        <div className="margin-global-top-1" />
                                    </>
                                ) : null
                            }
                        </Row>
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Typography
                        style={{ width: 'fit-content', lineHeight: '2.5' }}
                        variant="h8"
                        id="tableTitle"
                        component="div"
                    >
                        Sizes
                    </Typography>
                    <Col>
                        <Tooltip className="center-relative-vertical" title="Add Size">
                            <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={handleAddSize}>
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                {
                    sizes.map((size, index) => {
                        return (
                            <Row key={index}>
                                <Col md={4}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel error={size.nameError} id="demo-simple-select-label">Size</InputLabel>
                                        <Input
                                            value={size.name}
                                            onChange={e => handleSizesChange(e, index, 'name')}
                                            onBlur={e => handleSizesChange(e, index, 'name')}
                                            error={size.nameError}
                                        />
                                    </FormControl>
                                    <FormHelperText error={size.nameError}>{size.nameHelperText}</FormHelperText>
                                </Col>
                                <Col md={4}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel error={size.priceError} id="demo-simple-select-label">Price</InputLabel>
                                        <Input
                                            value={size.price}
                                            onChange={e => handleSizesChange(e, index, 'price')}
                                            onBlur={e => handleSizesChange(e, index, 'price')}
                                            error={size.priceError}
                                        />
                                        <FormHelperText error={size.priceError}>{size.priceHelperText}</FormHelperText>
                                    </FormControl>
                                </Col>
                                {
                                    sizes.length !== 1 ? (
                                        <Col>
                                            <Tooltip className="center-relative-vertical" title="Remove Size">
                                                <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={() => handleDeleteSize(index)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </Tooltip>
                                        </Col>
                                    ) : null
                                }
                            </Row>
                        )
                    })
                }
                {/* <div className="margin-global-top-1" />
                <Row>
                    <Typography
                        style={{ width: 'fit-content', lineHeight: '2.5' }}
                        variant="h8"
                        id="tableTitle"
                        component="div"
                    >
                        Options
                    </Typography>
                    <Col>
                        <Tooltip className="center-relative-vertical" title="Add Option">
                            <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={handleAddOption}>
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </Col>
                </Row> */}
                {/* <Row>
                    {
                        options.map((option, index) => {
                            return (
                                <Row key={index}>
                                    <Col md={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel error={option.nameError} id="demo-simple-select-label">Option</InputLabel>
                                            <Input
                                                value={option.name}
                                                onChange={e => handleOptionsChange(e, index, 'name')}
                                                onBlur={e => handleOptionsChange(e, index, 'name')}
                                                error={option.nameError}
                                            />
                                            <FormHelperText error={option.nameError}>{option.nameHelperText}</FormHelperText>
                                        </FormControl>
                                    </Col>
                                    <Col md={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel error={option.priceError} id="demo-simple-select-label">Price</InputLabel>
                                            <Input
                                                value={option.price}
                                                onChange={e => handleOptionsChange(e, index, 'price')}
                                                onBlur={e => handleOptionsChange(e, index, 'price')}
                                                error={option.priceError}
                                            />
                                            <FormHelperText error={option.priceError}>{option.priceHelperText}</FormHelperText>
                                        </FormControl>
                                    </Col>
                                    {
                                        options.length !== 0 ? (
                                            <Col>
                                                <Tooltip className="center-relative-vertical" title="Remove Option">
                                                    <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={() => handleDeleteOption(index)}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </Tooltip>
                                            </Col>
                                        ) : null
                                    }
                                </Row>
                            )
                        })
                    }
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Typography
                        style={{ width: 'fit-content', lineHeight: '2.5' }}
                        variant="h8"
                        id="tableTitle"
                        component="div"
                    >
                        Addons
                    </Typography>
                    <Col>
                        <Tooltip className="center-relative-vertical" title="Add Addon">
                            <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={handleAddAddon}>
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row>
                    {
                        addons.map((addon, index) => {
                            return (
                                <Row key={index}>
                                    <Col md={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel error={addon.nameError} id="demo-simple-select-label">Addon</InputLabel>
                                            <Input
                                                value={addon.name}
                                                onChange={e => handleAddonsChange(e, index, 'name')}
                                                onBlur={e => handleAddonsChange(e, index, 'name')}
                                                error={addon.nameError}
                                            />
                                            <FormHelperText error={addon.nameError}>{addon.nameHelperText}</FormHelperText>
                                        </FormControl>
                                    </Col>
                                    <Col md={4}>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel error={addon.priceError} id="demo-simple-select-label">Price</InputLabel>
                                            <Input
                                                value={addon.price}
                                                onChange={e => handleAddonsChange(e, index, 'price')}
                                                onBlur={e => handleAddonsChange(e, index, 'price')}
                                                error={addon.priceError}
                                            />
                                            <FormHelperText error={addon.priceError}>{addon.priceHelperText}</FormHelperText>
                                        </FormControl>
                                    </Col>
                                    {
                                        addons.length !== 0 ? (
                                            <Col>
                                                <Tooltip className="center-relative-vertical" title="Remove Addon">
                                                    <Button style={{ borderRadius: '100px', padding: '10px', minWidth: '0' }} variant="contained" onClick={() => handleDeleteAddon(index)}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </Tooltip>
                                            </Col>
                                        ) : null
                                    }
                                </Row>
                            )
                        })
                    }
                </Row> */}
                <div className="margin-global-top-1" />
                <Row>
                    <Col md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={checkBoxes.active}
                                onChange={handleActiveChange}
                            />}
                            label="Active"
                        />
                    </Col>
                </Row>
                <div className="margin-global-top-1" />
                <Row>
                    <Col className="flex-display">
                        <Button disabled={disabled} type="submit" variant="contained" color="secondary">
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default ProductForm;