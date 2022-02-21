import { Button, FormControl, InputLabel, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import api from '../../../../api';
import React from "react";

export const TableToolbar = (props) => {
    const { numSelected, handleSearch, searchText, selected, rows, setRows } = props;

    const [disabled, setDisabled] = React.useState(true);
    const [value, setValue] = React.useState('');

    React.useEffect(() => {
        if (value !== '') {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [value]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${api}/order/action?updateString=${value}&ids=${JSON.stringify(selected)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        const newRows = [];
        const strings = value.split('_');
        let isTrueSet = strings[1];
        if (strings[0] !== 'status') {
            isTrueSet = (strings[1] === 'true');
        }
        const field = strings[0];
        if (data.data === 'success') {
            for (let i = 0; i < rows.length; i++) {
                const element = rows[i];
                if (selected.includes(element.id)) {
                    if (field === 'status') {
                        element['orderStatusDisplay'] = isTrueSet;
                        element['orderStatus'] = isTrueSet;
                    } else {
                        element[field] = isTrueSet;
                    }
                }
                newRows.push(element);
            }
            setRows(newRows);
        }
    };

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Orders
                </Typography>
            )}

            {numSelected > 0 ? (
                <>
                    <div className="search-bar-toolbar1">
                        <FormControl variant="standard" style={{ width: '100%' }}>
                            <InputLabel id="demo-simple-select-standard-label">Select</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={value}
                                onChange={handleChange}
                                label="active"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={'active_true'}>Mark Active</MenuItem>
                                <MenuItem value={'active_false'}>Mark Inactive</MenuItem>
                                <MenuItem value={'status_Pending Payment'}>Mark Pending Payment</MenuItem>
                                <MenuItem value={'status_Processing'}>Mark Processing</MenuItem>
                                <MenuItem value={'status_Completed'}>Mark Completed</MenuItem>
                                <MenuItem value={'status_Cancelled'}>Mark Cancelled</MenuItem>
                                <MenuItem value={'status_Refunded'}>Mark Refunded</MenuItem>
                            </Select>
                        </FormControl>
                        <Button disabled={disabled} style={{ marginLeft: '10px' }} type="button" onClick={onSubmit} variant="contained" color="secondary">
                            Submit
                        </Button>
                    </div>
                </>
            ) : (
                <div className="search-bar-toolbar">
                    <TextField onChange={handleSearch} value={searchText} id="standard-basic" label="Search" variant="standard" />
                </div>
            )}
        </Toolbar>
    );
};