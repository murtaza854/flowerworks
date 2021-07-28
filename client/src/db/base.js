import { FormControl, Input, InputLabel, FormHelperText, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';

const createBaseTableData = (data) => {
    const { _id, name, price, imagePath } = data;
    const finalPrice = `PKR ${price}`;
    return { _id, name, finalPrice, imagePath };
}

const editObjCheck = (data, value, editObj) => {
    if (editObj) return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim() && obj.name !== editObj.name);
    else return data.find(obj => obj.name.toLowerCase().trim() === value.toLowerCase().trim())
}

const startAction = async (obj, selected, setOriginalTableRows, setTableRows) => {
}

const baseObj = {
    apiTable: `${api}/bases/TableData`,
    deleteApi: [`${api}/bases/getByIds`, `${api}/bases/delete`],
    createTableData : createBaseTableData,
    headCells: [
        // { id: '_id', numeric: false, disablePadding: true, label: 'ID' },
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'finalPrice', numeric: false, disablePadding: false, label: 'Price' },
        { id: 'imagePath', numeric: false, disablePadding: false, label: 'Image' },
    ],
    ManyChild: 'products',
    checkboxSelection: '_id',
    deletePage: 'name',
    editAllowed: true,
    deleteAllowed: true,
    addAllowed: true,
    modelName: 'Base',
    ordering: 'name',
    searchField: 'name',
    rightAllign: [],
    type: 'enhanced',
    startAction: startAction,
    actionOptions: [
        { label: '', value: '', type: '' }
    ],
    Form: function(id, classes) {
        let history = useHistory();

        let queryID = '';
        if (id != null) queryID = id;
        const [editObj, setEditObj] = useState(null);
        
        const hiddenFileInput = React.useRef(null);
        const [nameState, setNameState] = useState({name: '', helperText: 'Enter name Ex. Box', error: false});
        const [priceState, setPriceState] = useState({name: '', helperText: 'Enter a price Ex. 4000', error: false});
        const [imageState, setImageState] = useState({picturePreview: '', imgURl: '', helperText: 'Please choose an image.', error: false});

        const [basesArray, setUsersArray] = useState([]);
        const [isDisabled, setCanSubmit] = useState(true);
        const [pressedBtn, setPressedBtn] = useState(null);

        useEffect(() => {
            let flag = true;
            if (nameState.error === true) flag = true;
            else if (nameState.name.length === 0) flag = true;
            else if (priceState.error === true) flag = true;
            else if (priceState.name.length === 0) flag = true;
            else if (imageState.error === true) flag = true;
            else if (imageState.imgURl === '') flag = true;
            else flag = false;
            setCanSubmit(flag);
        }, [nameState, priceState, imageState]);

        useEffect(() => {(
            async () => {
                const response = await fetch(`${api}/bases/TableData`, {
                    headers: {'Content-Type': 'application/json'},
                });
                const content = await response.json();
                const obj = content.data.find(o => o._id === queryID);
                setEditObj(obj)
                setUsersArray(content.data)
            })();
        }, [queryID]);

        useEffect(() => {
            if (editObj) {
                setNameState(prevState => ({ ...prevState, name: editObj.name }));
                setPriceState(prevState => ({ ...prevState, name: editObj.price }));
                setImageState(prevState => ({ ...prevState, imgURl: editObj.imagePath }));
            }
        }, [editObj]);

        const imgRef = React.createRef();

        function changeNameState(event) {
            const { value } = event.target;
            setNameState(prevState => ({ ...prevState, name: value }));
            const obj = editObjCheck(basesArray, value, editObj);
            if (obj) setNameState(prevState => ({ ...prevState, helperText: `${obj.name} already exists!`, error: true }));
            else if (value === '') setNameState(prevState => ({ ...prevState, helperText: 'Name is required!', error: true }));
            else setNameState(prevState => ({ ...prevState, helperText: 'Enter name Ex. box', error: false }));
        };
        function changePriceState(event) {
            const { value } = event.target;
            setPriceState(prevState => ({ ...prevState, name: value }));
            if (value === '') setPriceState(prevState => ({ ...prevState, helperText: 'Price is required!', error: true }));
            else setPriceState(prevState => ({ ...prevState, helperText: 'Enter a price Ex. 4000', error: false }));
        };
        const onImageChange = event => {
            let reader = new FileReader();
            if (event.target.files && event.target.files[0]) {
                if (event.target.files[0].size / 1024 < 300) {
                    reader.readAsDataURL(event.target.files[0]);
                    reader.onload = () => {
                        setImageState({
                            picturePreview: event.target.files[0],
                            imgURl: URL.createObjectURL(event.target.files[0])
                        })
                    }
                } else {
                    setImageState(prevState => ({ ...prevState, helperText: 'The maximum size for an image can be 300 KB!', error: true }));
                }
            }
          };
          useEffect(() => {
              if (imgRef.current) {
                  console.log(imgRef.current);
              }
          }, [imgRef]);

        const handleClick = event => {
            hiddenFileInput.current.click();
        };

        const onSubmit = async e => {
            e.preventDefault();
            if (queryID === '') {
                const formData = new FormData();
                formData.append(
                    "file",
                    imageState.picturePreview
                );
                formData.append(
                    "data",
                    JSON.stringify({name: nameState.name, price: priceState.name})
                )
                await fetch(`${api}/bases/add`, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                const formData = new FormData();
                formData.append(
                    "file",
                    imageState.picturePreview
                );
                formData.append(
                    "data",
                    JSON.stringify({_id:queryID, name: nameState.name, price: priceState.name})
                )
                await fetch(`${api}/bases/update`, {
                    method: 'POST',
                    body: formData,
                });
            }
            if (pressedBtn === 1) {
                history.push('/admin/bases');
            }
            else {
                setNameState({name: '', helperText: 'Enter name Ex. Box', error: false});
                setPriceState({name: '', helperText: 'Enter a price Ex. 4000', error: false});
                setImageState({picturePreview: '', imgURl: '', helperText: 'Please choose an image.', error: false})
                history.push('/admin/bases/add');
            }
        };

        return (<form onSubmit={onSubmit} autoComplete="off">
            <fieldset>
                <legend>Details</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="name">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={nameState.error} color="secondary"  htmlFor="name">Name</InputLabel>
                            <Input
                                color="secondary" 
                                autoComplete="none"
                                value={nameState.name}
                                type="text"
                                error={nameState.error}
                                id="name"
                                name="name"
                                onChange={changeNameState}
                                onBlur={changeNameState}
                                aria-describedby="name-helper"
                            />
                            <FormHelperText error={nameState.error} id="name-helper">{nameState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} md={6} controlId="price">
                        <FormControl className={classes.formControl}>
                            <InputLabel error={priceState.error} color="secondary"  htmlFor="price">Price</InputLabel>
                            <Input
                                color="secondary" 
                                autoComplete="none"
                                value={priceState.name}
                                type="text"
                                error={priceState.error}
                                id="price"
                                name="price"
                                onChange={changePriceState}
                                onBlur={changePriceState}
                                aria-describedby="price-helper"
                            />
                            <FormHelperText error={priceState.error} id="price-helper">{priceState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
            </fieldset>
            <fieldset>
                <legend>Image</legend>
                <Row className={classes.rowGap}>
                    <Form.Group as={Col} md={6} controlId="imagePath">
                        <FormControl className={classes.formControl}>
                            {imageState.imgURl !== '' ? (
                                <img ref={imgRef} className={classes.image} src={imageState.imgURl} alt="Preview" />
                            ) : null
                            }
                            <input
                                className={classes.btn}
                                color="secondary" 
                                autoComplete="none"
                                style={{ display: 'none' }}
                                ref={hiddenFileInput}
                                type="file"
                                accept='image/*'
                                id="imagePath"
                                name="imagePath"
                                onChange={onImageChange}
                                aria-describedby="imagePath-helper"
                            />
                            <Button onClick={handleClick} type="button" variant="contained" color="primary" component="span">
                            Image Upload
                            </Button>
                            <FormHelperText error={imageState.error} id="image-helper">{imageState.helperText}</FormHelperText>
                        </FormControl>
                    </Form.Group>
                </Row>
            </fieldset>
            <input 
                type="text" 
                autoComplete="on" 
                value="" 
                style={{display: 'none'}} 
                readOnly={true}
                />
            <Button className={classes.button} onClick={_ => setPressedBtn(1)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save
            </Button>
            <Button onClick={_ => setPressedBtn(2)} disabled={isDisabled} type="submit" variant="contained" color="primary">
                Save and add another
            </Button>
        </form>);
    },
}

export default baseObj;