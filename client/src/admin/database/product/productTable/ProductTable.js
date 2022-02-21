import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { TableToolbar } from "../tableToolbar/TableToolbar";
import { TableHead } from '../tableHead/TableHead';
import { stableSort } from '../../stabalizedSort';
import { getComparator } from '../../comparator';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Col, Row } from 'react-bootstrap';


export default function ProductTable(props) {

    const {
        rows,
        filteredRows,
        setFilteredRows,
        tableOrder,
        searchField,
        setRows,
    } = props;

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(tableOrder);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchText, setSearchText] = React.useState('');
    const [open, setOpen] = React.useState([].fill(false, 0, rows.length));

    React.useEffect(() => {
        if (rows.length > 0) {
            setFilteredRows(rows.filter(row => {
                return row[searchField].toLowerCase().includes(searchText.toLowerCase());
            }));
        }
    }, [searchText, rows, setFilteredRows, searchField]);

    const handleSearch = event => {
        setSearchText(event.target.value);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredRows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableToolbar setRows={setRows} rows={rows} selected={selected} handleSearch={handleSearch} searchText={searchText} numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                    >
                        <TableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                        />
                        {/* <TableBody> */}
                        {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                   filteredRows.slice().sort(getComparator(order, orderBy)) */}
                        {filteredRows.length > 0 && stableSort(filteredRows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableBody key={row.id}>
                                        <TableRow
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    onClick={(event) => handleClick(event, row.id)}
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                    onChange={_ => { }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                <img style={{ width: '10rem' }} src={row.image} alt="storyImage" />
                                            </TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.base}</TableCell>
                                            <TableCell>
                                                {row.active ? (
                                                    <CheckIcon />
                                                ) : (
                                                    <CloseIcon />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        const openArray = [...open];
                                                        openArray[index] = !openArray[index];
                                                        setOpen(openArray);
                                                    }}
                                                >
                                                    {open[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: '2rem' }}>
                                                        <Typography variant="h5" gutterBottom component="div">
                                                            Product Details
                                                        </Typography>
                                                        <Row>
                                                            <Col md={6}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Sizes
                                                                </Typography>
                                                                <Row>
                                                                    <Col>
                                                                        <Typography variant="body1" gutterBottom>
                                                                            Label
                                                                        </Typography>
                                                                    </Col>
                                                                    <Col>
                                                                        <Typography variant="body1" gutterBottom>
                                                                            Price
                                                                        </Typography>
                                                                    </Col>
                                                                </Row>
                                                                {
                                                                    row.sizes.map((size, index) => (
                                                                        <Row key={index}>
                                                                            <Col>
                                                                                <Typography variant="body2" gutterBottom>
                                                                                    {size.name}
                                                                                </Typography>
                                                                            </Col>
                                                                            <Col>
                                                                                <Typography variant="body2" gutterBottom>
                                                                                    PKR {size.price}/-
                                                                                </Typography>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                }
                                                            </Col>
                                                            <Col md={6}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Description
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.description}
                                                                </Typography>
                                                            </Col>
                                                            {/* <Col md={6}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Options
                                                                </Typography>
                                                                {
                                                                    row.options.length > 0 ? (
                                                                        <>
                                                                            <Row>
                                                                                <Col>
                                                                                    <Typography variant="body1" gutterBottom>
                                                                                        Label
                                                                                    </Typography>
                                                                                </Col>
                                                                                <Col>
                                                                                    <Typography variant="body1" gutterBottom>
                                                                                        Price
                                                                                    </Typography>
                                                                                </Col>
                                                                            </Row>
                                                                            {
                                                                                row.options.map((option, index) => (
                                                                                    <Row key={index}>
                                                                                        <Col>
                                                                                            <Typography variant="body2" gutterBottom>
                                                                                                {option.name}
                                                                                            </Typography>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <Typography variant="body2" gutterBottom>
                                                                                                PKR {option.price}/-
                                                                                            </Typography>
                                                                                        </Col>
                                                                                    </Row>
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <Typography variant="body2" gutterBottom>
                                                                            No options added
                                                                        </Typography>
                                                                    )
                                                                }
                                                            </Col> */}
                                                        </Row>
                                                        <div className="margin-global-top-1" />
                                                        {/* <Row>
                                                            <Col md={6}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Addons
                                                                </Typography>
                                                                {
                                                                    row.addons.length > 0 ? (
                                                                        <>
                                                                            <Row>
                                                                                <Col>
                                                                                    <Typography variant="body1" gutterBottom>
                                                                                        Label
                                                                                    </Typography>
                                                                                </Col>
                                                                                <Col>
                                                                                    <Typography variant="body1" gutterBottom>
                                                                                        Price
                                                                                    </Typography>
                                                                                </Col>
                                                                            </Row>
                                                                            {
                                                                                row.addons.map((addon, index) => (
                                                                                    <Row key={index}>
                                                                                        <Col>
                                                                                            <Typography variant="body2" gutterBottom>
                                                                                                {addon.name}
                                                                                            </Typography>
                                                                                        </Col>
                                                                                        <Col>
                                                                                            <Typography variant="body2" gutterBottom>
                                                                                                PKR {addon.price}/-
                                                                                            </Typography>
                                                                                        </Col>
                                                                                    </Row>
                                                                                ))
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <Typography variant="body2" gutterBottom>
                                                                            No addons added
                                                                        </Typography>
                                                                    )
                                                                }
                                                            </Col>
                                                            <Col md={6}>
                                                                <Typography variant="h6" gutterBottom>
                                                                    Description
                                                                </Typography>
                                                                <Typography variant="body2" gutterBottom>
                                                                    {row.description}
                                                                </Typography>
                                                            </Col>
                                                        </Row> */}
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                        {/* </TableBody> */}
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}